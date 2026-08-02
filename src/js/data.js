import { safeParse, genId } from './utils.js';

export function dedup(arr, keyFn) {
  const seen = new Set();
  return arr.filter(item => {
    if (!item.id) item.id = genId();
    const key = keyFn(item);
    if (seen.has(item.id) || seen.has(key)) return false;
    seen.add(item.id);
    seen.add(key);
    return true;
  });
}

function normalizeList(trip, field, fallback, keyFn) {
  if (!trip) return [];
  const items = dedup(safeParse(trip[field], fallback), keyFn);
  trip[field] = JSON.stringify(items);
  return items;
}

export function getDocs(trip) {
  return normalizeList(trip, 'documents', [], item => (item.name || '').trim().toLowerCase());
}

export function getBudget(trip) {
  return normalizeList(trip, 'budget', [], item => (item.name || '').trim().toLowerCase());
}

export function getItin(trip) {
  return normalizeList(trip, 'itinerary', [], item => `${(item.title || '').trim().toLowerCase()}||${item.date || ''}||${item.time || ''}`);
}

export function getMembers(trip) {
  if (!trip) return ['Duy', 'Vy'];
  return safeParse(trip.members, ['Duy', 'Vy']);
}

export function getPacking(trip) {
  if (!trip) return {};
  const raw = safeParse(trip.packing, {});
  const out = {};
  Object.entries(raw).forEach(([member, data]) => {
    const md = { outbound: {}, return: {} };
    ['outbound', 'return'].forEach(stage => {
      let stageRows = {};
      if (data && typeof data === 'object') {
        stageRows = data[stage] || (!data.outbound && !data.return ? data : {});
      }
      const cleaned = {};
      const seenIds = new Set();
      const seenKeys = new Set();
      Object.entries(stageRows).forEach(([group, items]) => {
        if (!Array.isArray(items)) return;
        const cleanItems = items.filter(item => {
          if (!item.id) item.id = genId();
          const key = `${group.toLowerCase()}||${(item.item || '').toLowerCase()}`;
          if (seenIds.has(item.id) || seenKeys.has(key)) return false;
          seenIds.add(item.id);
          seenKeys.add(key);
          return true;
        });
        if (cleanItems.length) cleaned[group] = cleanItems;
      });
      md[stage] = cleaned;
    });
    out[member] = md;
  });
  return out;
}
