import { safeParse, genId } from './utils.js';

export function dedup(arr, keyFn) {
  const seen = new Set();
  return arr.filter(x => { if (!x.id) x.id = genId(); const k = keyFn(x); if (seen.has(x.id) || seen.has(k)) return false; seen.add(x.id); seen.add(k); return true; });
}
export function getDocs(trip) { if (!trip) return []; const d = dedup(safeParse(trip.documents, []), x => (x.name || '').trim().toLowerCase()); trip.documents = JSON.stringify(d); return d; }
export function getBudget(trip) { if (!trip) return []; const b = dedup(safeParse(trip.budget, []), x => (x.name || '').trim().toLowerCase()); trip.budget = JSON.stringify(b); return b; }
export function getItin(trip) { if (!trip) return []; const i = dedup(safeParse(trip.itinerary, []), x => `${(x.title || '').trim().toLowerCase()}||${x.date || ''}||${x.time || ''}`); trip.itinerary = JSON.stringify(i); return i; }
export function getMembers(trip) { return safeParse(trip.members, ['Duy', 'Vy']); }
export function getPacking(trip) {
  const raw = safeParse(trip.packing, {}); const out = {};
  Object.entries(raw).forEach(([member, data]) => {
    const md = { outbound: {}, return: {} };
    ['outbound', 'return'].forEach(stage => {
      const sr = (data && typeof data === 'object') ? (data[stage] || (!data.outbound && !data.return ? data : {})) : {};
      const cleaned = {}; const seenIds = new Set(), seenK = new Set();
      Object.entries(sr).forEach(([g, items]) => { if (!Array.isArray(items)) return; const ci = items.filter(it => { if (!it.id) it.id = genId(); const k = `${g.toLowerCase()}||${(it.item || '').toLowerCase()}`; if (seenIds.has(it.id) || seenK.has(k)) return false; seenIds.add(it.id); seenK.add(k); return true; }); if (ci.length) cleaned[g] = ci; });
      md[stage] = cleaned;
    });
    out[member] = md;
  });
  return out;
}
