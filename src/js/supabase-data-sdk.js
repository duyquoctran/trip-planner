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

function normalizeName(value, fallback = 'Traveler') {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object') {
    return value.display_name || value.name || value.email || fallback;
  }
  return fallback;
}

function buildLegacyDocuments(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    id: row.id,
    name: row.file_name || row.name || 'document',
    url: row.file_url || row.url || '',
    mime_type: row.mime_type || '',
    size_bytes: row.size_bytes || null,
    uploaded_by: row.uploaded_by || null,
    uploaded_at: row.uploaded_at || null,
    ...(row.metadata && typeof row.metadata === 'object' ? row.metadata : {}),
  }));
}

function buildLegacyBudget(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    id: row.id,
    name: row.title || row.name || 'Expense',
    category: row.category || '',
    cost: Number(row.amount ?? 0),
    currency: row.currency || 'USD',
    paid: !!(row.paid_by || row.status === 'paid'),
    status: row.status || (row.paid_by ? 'paid' : 'unpaid'),
    note: row.notes || '',
    notes: row.notes || '',
    link: row.link || '',
    created_at: row.created_at || null,
  }));
}

function buildLegacyItinerary(dayRows, itemRows) {
  const dayMap = new Map((Array.isArray(dayRows) ? dayRows : []).map((day) => [day.id, day]));

  return (Array.isArray(itemRows) ? itemRows : []).map((row) => {
    const day = row.day_id ? dayMap.get(row.day_id) : null;
    return {
      id: row.id,
      title: row.title || 'Activity',
      date: day && day.date ? day.date : '',
      time: row.start_time || row.end_time || '',
      start_time: row.start_time || '',
      end_time: row.end_time || '',
      location: row.location || '',
      notes: row.notes || '',
      sort_order: row.sort_order ?? 0,
      status: row.status || 'planned',
      checked: !!row.checked,
    };
  });
}

function buildLegacyPacking(rows, memberMap) {
  const packing = {};

  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const memberName = memberMap.get(row.member_id) || 'Traveler';
    if (!packing[memberName]) {
      packing[memberName] = { outbound: {}, return: {} };
    }

    const stageName = row.packing_stage === 'return' ? 'return' : 'outbound';
    if (!packing[memberName][stageName]) {
      packing[memberName][stageName] = {};
    }

    const groupName = row.category || 'general';
    if (!packing[memberName][stageName][groupName]) {
      packing[memberName][stageName][groupName] = [];
    }

    packing[memberName][stageName][groupName].push({
      id: row.id,
      item: row.item_name || row.item || 'Item',
      category: row.category || 'general',
      quantity: row.quantity ?? 1,
      packed: !!row.packed,
      checked: !!row.packed,
      status: row.packed ? 'packed' : 'not_started',
      note: row.notes || '',
      notes: row.notes || '',
    });
  });

  return packing;
}

function buildLegacyTrip(row, relationData = {}) {
  const memberRows = Array.isArray(relationData.members) ? relationData.members : [];
  const documentRows = Array.isArray(relationData.documents) ? relationData.documents : [];
  const budgetRows = Array.isArray(relationData.budget) ? relationData.budget : [];
  const dayRows = Array.isArray(relationData.days) ? relationData.days : [];
  const itemRows = Array.isArray(relationData.itineraryItems) ? relationData.itineraryItems : [];
  const packingRows = Array.isArray(relationData.packingItems) ? relationData.packingItems : [];

  const members = memberRows
    .map((member) => normalizeName(member, 'Traveler'))
    .filter(Boolean);

  const packingMemberMap = new Map();
  memberRows.forEach((member) => {
    if (member && member.id) packingMemberMap.set(member.id, normalizeName(member, 'Traveler'));
  });

  const tripDates = row.trip_dates || [row.start_date, row.end_date].filter(Boolean).join(' – ') || '';

  return {
    ...row,
    __backendId: row.id || row.__backendId || null,
    trip_name: row.trip_name || '',
    trip_dates: tripDates,
    start_date: row.start_date || null,
    end_date: row.end_date || null,
    trip_image: row.trip_image || '',
    status: row.status || 'planning',
    previous_status: row.previous_status || '',
    created_at: row.created_at || new Date().toISOString(),
    documents: JSON.stringify(buildLegacyDocuments(documentRows)),
    budget: JSON.stringify(buildLegacyBudget(budgetRows)),
    itinerary: JSON.stringify(buildLegacyItinerary(dayRows, itemRows)),
    packing: JSON.stringify(buildLegacyPacking(packingRows, packingMemberMap)),
    members: JSON.stringify(members.length ? members : ['Duy', 'Vy']),
  };
}

function buildTripRecordPayload(trip) {
  let startDate = trip.start_date || null;
  let endDate = trip.end_date || null;

  if (typeof trip.trip_dates === 'string' && trip.trip_dates.trim()) {
    const value = trip.trip_dates.trim();
    const rangeMatch = value.match(/^(\d{4}-\d{2}-\d{2})\s*(?:[–-]|to)\s*(\d{4}-\d{2}-\d{2})$/i);

    if (rangeMatch) {
      startDate = rangeMatch[1];
      endDate = rangeMatch[2];
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      startDate = value;
      endDate = null;
    }
  }

  return {
    trip_name: trip.trip_name || '',
    start_date: startDate,
    end_date: endDate,
    trip_image: trip.trip_image || '',
    status: trip.status || 'planning',
    previous_status: trip.previous_status || '',
    created_at: trip.created_at || new Date().toISOString(),
  };
}

async function fetchTripRelations(tripId) {
  if (!client || !tripId) {
    return { members: [], documents: [], budget: [], days: [], itineraryItems: [], packingItems: [] };
  }

  const [membersRes, documentsRes, expensesRes, daysRes, itineraryRes, packingRes] = await Promise.all([
    client.from('trip_members').select('*').eq('trip_id', tripId).order('joined_at', { ascending: true }),
    client.from('trip_documents').select('*').eq('trip_id', tripId).order('uploaded_at', { ascending: false }),
    client.from('trip_expenses').select('*').eq('trip_id', tripId).order('created_at', { ascending: false }),
    client.from('trip_days').select('*').eq('trip_id', tripId).order('date', { ascending: true }),
    client.from('trip_itinerary_items').select('*').eq('trip_id', tripId).order('sort_order', { ascending: true }),
    client.from('trip_packing_items').select('*').eq('trip_id', tripId).order('sort_order', { ascending: true }),
  ]);

  return {
    members: membersRes.data || [],
    documents: documentsRes.data || [],
    budget: expensesRes.data || [],
    days: daysRes.data || [],
    itineraryItems: itineraryRes.data || [],
    packingItems: packingRes.data || [],
  };
}

async function saveTripRelations(tripId, trip) {
  if (!client || !tripId) {
    return { isOk: true };
  }

  const memberPayload = parseJson(trip.members, ['Duy', 'Vy']);
  const memberRows = (Array.isArray(memberPayload) ? memberPayload : []).map((member) => {
    if (typeof member === 'string') {
      return { trip_id: tripId, display_name: member, email: null, role: 'traveler' };
    }
    return {
      trip_id: tripId,
      display_name: member.display_name || member.name || 'Traveler',
      email: member.email || null,
      role: member.role || 'traveler',
    };
  });

  await client.from('trip_members').delete().eq('trip_id', tripId);
  let memberMap = new Map();
  if (memberRows.length) {
    const { data: insertedMembers } = await client.from('trip_members').insert(memberRows).select();
    memberMap = new Map((insertedMembers || []).map((member) => [member.display_name, member.id]));
  }

  await client.from('trip_documents').delete().eq('trip_id', tripId);
  const documentPayload = parseJson(trip.documents, []);
  const documentRows = Array.isArray(documentPayload) ? documentPayload : [];
  if (documentRows.length) {
    await client.from('trip_documents').insert(documentRows.map((doc) => ({
      trip_id: tripId,
      file_name: doc.name || doc.file_name || 'document',
      file_url: doc.url || doc.file_url || '',
      mime_type: doc.mime_type || '',
      size_bytes: doc.size_bytes || null,
      uploaded_by: doc.uploaded_by || null,
      metadata: doc,
    })));
  }

  await client.from('trip_expenses').delete().eq('trip_id', tripId);
  const budgetPayload = parseJson(trip.budget, []);
  const budgetRows = Array.isArray(budgetPayload) ? budgetPayload : [];
  if (budgetRows.length) {
    await client.from('trip_expenses').insert(budgetRows.map((item) => ({
      trip_id: tripId,
      title: item.name || item.title || 'Expense',
      category: item.category || '',
      amount: Number(item.cost ?? item.amount ?? 0),
      currency: item.currency || 'USD',
      paid_by: item.paid ? 'self' : '',
      status: item.status || (item.paid ? 'paid' : 'unpaid'),
      notes: item.note || item.notes || '',
      link: item.link || '',
    })));
  }

  const itineraryPayload = parseJson(trip.itinerary, []);
  const itineraryRows = Array.isArray(itineraryPayload) ? itineraryPayload : [];

  await client.from('trip_days').delete().eq('trip_id', tripId);
  await client.from('trip_itinerary_items').delete().eq('trip_id', tripId);

  if (itineraryRows.length) {
    const uniqueDates = [...new Set(itineraryRows.filter((item) => item.date).map((item) => item.date))];
    const dayRows = uniqueDates.map((date, index) => ({
      trip_id: tripId,
      day_number: index + 1,
      date,
      title: '',
      notes: '',
    }));

    const { data: insertedDays = [] } = dayRows.length
      ? await client.from('trip_days').insert(dayRows).select()
      : { data: [] };
    const dayMap = new Map((insertedDays || []).map((day) => [day.date, day.id]));

    const itemRows = itineraryRows.map((item) => ({
      trip_id: tripId,
      day_id: item.date ? dayMap.get(item.date) : null,
      title: item.title || 'Activity',
      start_time: item.start_time || item.time || null,
      end_time: item.end_time || null,
      location: item.location || '',
      notes: item.notes || '',
      status: item.status || (item.checked ? 'completed' : 'planned'),
      checked: !!item.checked,
      sort_order: item.sort_order ?? 0,
    }));

    if (itemRows.length) {
      await client.from('trip_itinerary_items').insert(itemRows);
    }
  }

  const packingPayload = parseJson(trip.packing, {});
  const packingRows = [];
  Object.entries(packingPayload || {}).forEach(([memberName, stages]) => {
    const memberId = memberMap.get(memberName);
    if (!memberId || !stages || typeof stages !== 'object') return;

    Object.entries(stages).forEach(([stageKey, groups]) => {
      if (stageKey !== 'outbound' && stageKey !== 'return') return;
      if (!groups || typeof groups !== 'object') return;

      Object.entries(groups).forEach(([groupName, items]) => {
        const list = Array.isArray(items) ? items : [];
        list.forEach((item, index) => {
          packingRows.push({
            trip_id: tripId,
            member_id: memberId,
            packing_stage: stageKey,
            category: groupName || item.category || 'general',
            item_name: item.item || item.name || item.title || 'Item',
            quantity: Number(item.quantity ?? 1),
            packed: !!(item.packed || item.checked),
            notes: item.notes || '',
            sort_order: index,
          });
        });
      });
    });
  });

  await client.from('trip_packing_items').delete().eq('trip_id', tripId);
  if (packingRows.length) {
    await client.from('trip_packing_items').insert(packingRows);
  }

  return { isOk: true };
}

if (!createClient) {
  console.warn('Supabase UMD createClient not found. Falling back to REST fetch wrapper.');
}
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase config missing or invalid. Set window.__SUPABASE__ with url and anonKey.');
}

console.info('Supabase client initialization:', {
  supabaseUrl,
  anonKeyPreview: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 20)}...` : null,
  usingClient: !!createClient,
});

const client = (createClient && supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;
let latestHandler = null;

function buildHeaders() {
  return {
    apikey: supabaseAnonKey,
    Authorization: 'Bearer ' + supabaseAnonKey,
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

  return {
    data,
    error: res.ok ? null : { message: data?.message || res.statusText, status: res.status, details: data },
    status: res.status,
  };
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

    const normalizedTrips = [];
    for (const trip of data || []) {
      const relations = await fetchTripRelations(trip.id);
      normalizedTrips.push(buildLegacyTrip(trip, relations));
    }

    return normalizedTrips;
  }

  const { data, error, status } = await restFetch('trips?select=*', { method: 'GET' });
  if (error) {
    console.error('Supabase REST fetch error', status, error);
    return [];
  }

  const trips = [];
  for (const trip of data || []) {
    const [members, documents, budget, days, itineraryItems, packingItems] = await Promise.all([
      restFetch(`trip_members?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
      restFetch(`trip_documents?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
      restFetch(`trip_expenses?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
      restFetch(`trip_days?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
      restFetch(`trip_itinerary_items?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
      restFetch(`trip_packing_items?trip_id=eq.${encodeURIComponent(trip.id)}&select=*`),
    ]);

    trips.push(buildLegacyTrip(trip, {
      members: members.data || [],
      documents: documents.data || [],
      budget: budget.data || [],
      days: days.data || [],
      itineraryItems: itineraryItems.data || [],
      packingItems: packingItems.data || [],
    }));
  }

  return trips;
}

async function notifyDataHandler() {
  if (!latestHandler || typeof latestHandler.onDataChanged !== 'function') return;
  const trips = await fetchTrips();
  latestHandler.onDataChanged(trips);
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
      const payload = buildTripRecordPayload(trip);
      const { data, error, status } = await restFetch('trips', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (error) {
        console.error('Supabase REST create error', status, error);
        return { isError: true, error };
      }
      const createdTrip = Array.isArray(data) ? data[0] : data;
      if (createdTrip?.id) {
        await saveTripRelations(createdTrip.id, trip);
      }
      await notifyDataHandler();
      return { isOk: true };
    }

    const payload = buildTripRecordPayload(trip);
    const { data, error } = await client.from('trips').insert(payload).select();
    if (error) {
      console.error('Supabase create error', error);
      return { isError: true, error };
    }

    const createdTrip = Array.isArray(data) ? data[0] : data;
    if (createdTrip?.id) {
      await saveTripRelations(createdTrip.id, trip);
    }

    await notifyDataHandler();
    return { isOk: true };
  },

  async update(trip) {
    const id = trip.__backendId || trip.id;
    if (!id) {
      return { isError: true, error: 'missing_id' };
    }

    const payload = buildTripRecordPayload(trip);
    if (!client) {
      const { error, status } = await restFetch(`trips?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      if (error) {
        console.error('Supabase REST update error', status, error);
        return { isError: true, error };
      }
      await saveTripRelations(id, trip);
      await notifyDataHandler();
      return { isOk: true };
    }

    const { error } = await client.from('trips').update(payload).eq('id', id);
    if (error) {
      console.error('Supabase update error', error);
      return { isError: true, error };
    }

    await saveTripRelations(id, trip);
    await notifyDataHandler();
    return { isOk: true };
  },

  async delete(trip) {
    const id = trip.__backendId || trip.id;
    if (!id) {
      return { isError: true, error: 'missing_id' };
    }

    if (!client) {
      const { error, status } = await restFetch(`trips?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
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
