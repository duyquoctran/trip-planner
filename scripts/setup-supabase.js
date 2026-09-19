import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Client } = pg;
const connectionString = process.env.SUPABASE_DB_URL;

if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL environment variable.');
  console.error('Set it to your Supabase Postgres connection string before running this script.');
  console.error('Example:');
  console.error('  SUPABASE_DB_URL="postgresql://postgres:password@db.dilhxudpupvwclsxnbjl.supabase.co:5432/postgres" npm run setup-supabase');
  process.exit(1);
}

const tableDefinitions = [
  {
    name: 'trips',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trips (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_name text NOT NULL DEFAULT '',
        start_date date,
        end_date date,
        trip_image text NOT NULL DEFAULT '',
        status text NOT NULL DEFAULT 'planning'
          CHECK (status IN ('planning','confirmed','in_progress','completed','cancelled','archived')),
        previous_status text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb
      );`
  },
  {
    name: 'trip_members',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_members (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        display_name text NOT NULL,
        email text,
        role text NOT NULL DEFAULT 'traveler',
        joined_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE (trip_id, email)
      );`
  },
  {
    name: 'trip_documents',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_documents (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        file_name text NOT NULL,
        file_url text NOT NULL,
        mime_type text,
        size_bytes bigint,
        uploaded_by text,
        uploaded_at timestamptz NOT NULL DEFAULT now(),
        metadata jsonb NOT NULL DEFAULT '{}'::jsonb
      );`
  },
  {
    name: 'trip_expenses',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_expenses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        title text NOT NULL,
        category text,
        amount numeric(12,2) NOT NULL DEFAULT 0,
        currency char(3) NOT NULL DEFAULT 'USD',
        paid_by text,
        status text NOT NULL DEFAULT 'unpaid'
          CHECK (status IN ('unpaid', 'partial', 'paid')),
        notes text,
        link text,
        created_at timestamptz NOT NULL DEFAULT now()
      );`
  },
  {
    name: 'trip_days',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_days (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        day_number integer NOT NULL,
        date date NOT NULL,
        title text,
        notes text,
        UNIQUE (trip_id, day_number)
      );`
  },
  {
    name: 'trip_itinerary_items',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_itinerary_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        day_id uuid REFERENCES public.trip_days (id) ON DELETE CASCADE,
        title text NOT NULL,
        start_time time,
        end_time time,
        location text,
        notes text,
        status text NOT NULL DEFAULT 'planned'
          CHECK (status IN ('planned', 'confirmed', 'completed')),
        checked boolean NOT NULL DEFAULT false,
        sort_order integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );`
  },
  {
    name: 'trip_packing_items',
    ddl: `
      CREATE TABLE IF NOT EXISTS public.trip_packing_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_id uuid NOT NULL REFERENCES public.trips (id) ON DELETE CASCADE,
        member_id uuid REFERENCES public.trip_members (id) ON DELETE CASCADE,
        packing_stage text NOT NULL DEFAULT 'outbound'
          CHECK (packing_stage IN ('outbound', 'return')),
        category text NOT NULL DEFAULT 'general',
        item_name text NOT NULL,
        quantity integer NOT NULL DEFAULT 1,
        packed boolean NOT NULL DEFAULT false,
        notes text,
        sort_order integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );`
  }
];

async function ensurePolicies(client, tableName) {
  await client.query(`ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`);

  await client.query(`GRANT USAGE ON SCHEMA public TO anon;`);
  await client.query(`GRANT USAGE ON SCHEMA public TO authenticated;`);

  const policyNames = ['anon_select', 'anon_insert', 'anon_update', 'anon_delete'];

  for (const policyName of policyNames) {
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_policies
          WHERE schemaname = 'public'
            AND tablename = '${tableName}'
            AND policyname = '${policyName}'
        ) THEN
          IF '${policyName}' = 'anon_select' THEN
            CREATE POLICY ${policyName} ON public.${tableName} FOR SELECT USING (true);
          ELSIF '${policyName}' = 'anon_insert' THEN
            CREATE POLICY ${policyName} ON public.${tableName} FOR INSERT WITH CHECK (true);
          ELSIF '${policyName}' = 'anon_update' THEN
            CREATE POLICY ${policyName} ON public.${tableName} FOR UPDATE USING (true) WITH CHECK (true);
          ELSIF '${policyName}' = 'anon_delete' THEN
            CREATE POLICY ${policyName} ON public.${tableName} FOR DELETE USING (true);
          END IF;
        END IF;
      END $$;
    `);
  }

  await client.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON public.${tableName} TO anon;`);
  await client.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON public.${tableName} TO authenticated;`);
}

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    console.log('Connected to Supabase Postgres.');
    console.log('Ensuring pgcrypto extension is available...');
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
    console.log('Creating normalized relational tables...');

    for (const { ddl } of tableDefinitions) {
      await client.query(ddl);
    }

    console.log('Creating indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS trips_created_at_idx ON public.trips (created_at DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS trips_status_idx ON public.trips (status);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_members_trip_id_idx ON public.trip_members (trip_id);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_documents_trip_id_idx ON public.trip_documents (trip_id, uploaded_at DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_expenses_trip_id_idx ON public.trip_expenses (trip_id, created_at DESC);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_days_trip_id_date_idx ON public.trip_days (trip_id, date);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_itinerary_items_trip_id_sort_idx ON public.trip_itinerary_items (trip_id, day_id, sort_order);');
    await client.query('CREATE INDEX IF NOT EXISTS trip_packing_items_trip_id_member_idx ON public.trip_packing_items (trip_id, member_id, packed, sort_order);');

    console.log('Creating updated_at trigger...');
    await client.query(`
      CREATE OR REPLACE FUNCTION public.set_updated_at()
      RETURNS trigger AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS trips_set_updated_at ON public.trips;
      CREATE TRIGGER trips_set_updated_at
      BEFORE UPDATE ON public.trips
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
    `);

    console.log('Configuring Row Level Security for all tables...');
    for (const { name } of tableDefinitions) {
      await ensurePolicies(client, name);
    }

    console.log('Normalized Supabase schema setup complete.');
    console.log('Created tables: trips, trip_members, trip_documents, trip_expenses, trip_days, trip_itinerary_items, trip_packing_items.');
    console.log('The application should read/write child tables and rebuild the legacy JSON shape in the frontend adapter.');
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error('Failed to setup Supabase normalized schema:', err);
  process.exit(1);
});