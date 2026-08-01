const config = window.__SUPABASE__ || {};
const supabaseUrl = config.url || '';
const supabaseAnonKey = config.anonKey || '';

window.dataSdk = window.dataSdk || {
  init: async () => ({ isOk: false, error: 'dataSdk_not_loaded' }),
  create: async () => ({ isError: true, error: 'dataSdk_not_loaded' }),
  update: async () => ({ isError: true, error: 'dataSdk_not_loaded' }),
  delete: async () => ({ isError: true, error: 'dataSdk_not_loaded' }),
};

const createClient = (window.supabase && typeof window.supabase.createClient === 'function')
  ? window.supabase.createClient
  : (typeof window.createClient === 'function' ? window.createClient : null);

function parseJson(value, fallback) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (err) {
      return fallback;
    }
  }
  if (value && typeof value === 'object') return value;
  return fallback;
}

function stringifyField(value, fallback) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value ?? fallback);
  } catch (err) {
    return JSON.stringify(fallback);
  }
}

function normalizeTrip(row) {
  return {
    ...row,
    __backendId: row.id || row.__backendId || null,
    documents: typeof row.documents === 'string' ? row.documents : JSON.stringify(parseJson(row.documents, [])),
    budget: typeof row.budget === 'string' ? row.budget : JSON.stringify(parseJson(row.budget, [])),
    itinerary: typeof row.itinerary === 'string' ? row.itinerary : JSON.stringify(parseJson(row.itinerary, [])),
    packing: typeof row.packing === 'string' ? row.packing : JSON.stringify(parseJson(row.packing, {})),
    members: typeof row.members === 'string' ? row.members : JSON.stringify(parseJson(row.members, ['Duy', 'Vy'])),
    previous_status: row.previous_status || '',
    trip_image: row.trip_image || '',
    status: row.status || 'planning',
    created_at: row.created_at || new Date().toISOString(),
  };
}

if (!createClient) {
  console.warn('Supabase UMD createClient not found. Falling back to REST fetch wrapper.');
}
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase config missing or invalid. Set window.__SUPABASE__ with url and anonKey.');
}
console.info('Supabase client initialization:', { supabaseUrl, anonKeyPreview: supabaseAnonKey ? supabaseAnonKey.slice(0, 20) + '...' : null, usingClient: !!createClient });
const client = (createClient && supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;
let latestHandler = null;

function buildHeaders() {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function restFetch(path, options = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { data: null, error: { message: 'missing_config' }, status: 0 };
  }

  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${path}`;
  const headers = { ...buildHeaders(), ...options.headers, Prefer: 'return=minimal' };
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = text;
  }
  return { data, error: res.ok ? null : { message: data?.message || res.statusText, status: res.status, details: data }, status: res.status };
}

async function fetchTrips() {
  if (client) {
    const { data, error } = await client
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error', error);
      return [];
    }

    return (data || []).map(normalizeTrip);
  }

  const { data, error, status } = await restFetch('trips?select=*', { method: 'GET' });
  if (error) {
    console.error('Supabase REST fetch error', status, error);
    return [];
  }
  return (data || []).map(normalizeTrip);
}

async function notifyDataHandler() {
  if (!latestHandler || typeof latestHandler.onDataChanged !== 'function') return;
  const trips = await fetchTrips();
  latestHandler.onDataChanged(trips);
}

function buildPayload(trip) {
  return {
    trip_name: trip.trip_name || '',
    trip_dates: trip.trip_dates || '',
    trip_image: trip.trip_image || '',
    status: trip.status || 'planning',
    created_at: trip.created_at || new Date().toISOString(),
    documents: parseJson(trip.documents, []),
    budget: parseJson(trip.budget, []),
    itinerary: parseJson(trip.itinerary, []),
    packing: parseJson(trip.packing, {}),
    members: parseJson(trip.members, ['Duy', 'Vy']),
    previous_status: trip.previous_status || '',
  };
}

window.dataSdk = {
  async init(handler) {
    latestHandler = handler;
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase config missing. Set window.__SUPABASE__.');
      return { isOk: false, error: 'missing_config' };
    }
    const trips = await fetchTrips();
    if (handler && typeof handler.onDataChanged === 'function') {
      handler.onDataChanged(trips);
    }
    return { isOk: true };
  },

  async create(trip) {
    if (!client) {
      const payload = buildPayload(trip);
      const { error, status } = await restFetch('trips', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (error) {
        console.error('Supabase REST create error', status, error);
        return { isError: true, error };
      }
      await notifyDataHandler();
      return { isOk: true };
    }
    const payload = buildPayload(trip);
    const { error } = await client.from('trips').insert(payload);
    if (error) {
      console.error('Supabase create error', error);
      return { isError: true, error };
    }
    await notifyDataHandler();
    return { isOk: true };
  },

  async update(trip) {
    const id = trip.__backendId || trip.id;
    if (!id) {
      return { isError: true, error: 'missing_id' };
    }
    const payload = buildPayload(trip);
    if (!client) {
      const { error, status } = await restFetch(`trips?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify(payload),
        }
      );
      if (error) {
        console.error('Supabase REST update error', status, error);
        return { isError: true, error };
      }
      await notifyDataHandler();
      return { isOk: true };
    }
    const { error } = await client.from('trips').update(payload).eq('id', id);
    if (error) {
      console.error('Supabase update error', error);
      return { isError: true, error };
    }
    await notifyDataHandler();
    return { isOk: true };
  },

  async delete(trip) {
    const id = trip.__backendId || trip.id;
    if (!id) {
      return { isError: true, error: 'missing_id' };
    }
    if (!client) {
      const { error, status } = await restFetch(`trips?id=eq.${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      );
      if (error) {
        console.error('Supabase REST delete error', status, error);
        return { isError: true, error };
      }
      await notifyDataHandler();
      return { isOk: true };
    }
    const { error } = await client.from('trips').delete().eq('id', id);
    if (error) {
      console.error('Supabase delete error', error);
      return { isError: true, error };
    }
    await notifyDataHandler();
    return { isOk: true };
  },
};



