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

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    console.log('Connected to Supabase Postgres.');
    console.log('Ensuring pgcrypto extension is available...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    console.log('Creating trips table if it does not exist...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        trip_name text NOT NULL DEFAULT '',
        trip_dates text NOT NULL DEFAULT '',
        trip_image text NOT NULL DEFAULT '',
        status text NOT NULL DEFAULT 'planning',
        created_at timestamptz NOT NULL DEFAULT now(),
        documents jsonb NOT NULL DEFAULT '[]'::jsonb,
        budget jsonb NOT NULL DEFAULT '[]'::jsonb,
        itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
        packing jsonb NOT NULL DEFAULT '{}'::jsonb,
        members jsonb NOT NULL DEFAULT '[]'::jsonb,
        previous_status text NOT NULL DEFAULT ''
      );
    `);
    console.log('Creating index on created_at...');
    await client.query(`CREATE INDEX IF NOT EXISTS trips_created_at_idx ON trips (created_at DESC);`);

    console.log('Enabling Row Level Security and policies for anonymous access...');
    await client.query(`ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;`);
    await client.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE policyname = 'anon_select' AND tablename = 'trips'
        ) THEN
          CREATE POLICY anon_select ON public.trips
            FOR SELECT USING (true);
        END IF;
      END
    $$;`);
    await client.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE policyname = 'anon_insert' AND tablename = 'trips'
        ) THEN
          CREATE POLICY anon_insert ON public.trips
            FOR INSERT WITH CHECK (true);
        END IF;
      END
    $$;`);
    await client.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE policyname = 'anon_update' AND tablename = 'trips'
        ) THEN
          CREATE POLICY anon_update ON public.trips
            FOR UPDATE USING (true) WITH CHECK (true);
        END IF;
      END
    $$;`);
    await client.query(`DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_policies
          WHERE policyname = 'anon_delete' AND tablename = 'trips'
        ) THEN
          CREATE POLICY anon_delete ON public.trips
            FOR DELETE USING (true);
        END IF;
      END
    $$;`);

    console.log('Granting table privileges to the anon and authenticated roles...');
    await client.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO anon;`);
    await client.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;`);

    console.log('Supabase trips table setup complete with anon access policies.');
    console.log('Note: the frontend needs a Supabase anon key and project URL; set window.__SUPABASE__ in index.html.');
  } finally {
    await client.end();
  }
}

run().catch(err => {
  console.error('Failed to setup Supabase schema:', err);
  process.exit(1);
});