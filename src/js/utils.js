export function safeParse(s, fb) {
  try { return JSON.parse(s || JSON.stringify(fb)); } catch (e) { return fb; }
}
export function genId() { return 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1e6); }
export function esc(s) { return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export const GRADIENTS = ['linear-gradient(135deg,#fbcfe8 0%,#ccfbf1 100%)', 'linear-gradient(135deg,#fef3c7 0%,#fbcfe8 100%)', 'linear-gradient(135deg,#ccfbf1 0%,#fdba74 100%)', 'linear-gradient(135deg,#e0f2fe 0%,#fbcfe8 100%)'];

export function fmtCurrency(v, cur) {
  const n = parseFloat(String(v).replace(/[^
\d.-]/g, ''));
  if (isNaN(n)) return '—';
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(n); } catch (e) { return n.toLocaleString() + ' ' + cur; }
}
export function fmtDate(s) { if (!s) return ''; try { const d = new Date(s); if (isNaN(d)) return s; return d.toLocaleDateString(); } catch (e) { return s; } }
export function fmtTripDates(s) { if (!s) return 'No dates'; const p = s.split(' – '); return p.length === 2 ? fmtDate(p[0]) + ' – ' + fmtDate(p[1]) : fmtDate(s); }
export function fmtTime24(ts) {
  if (!ts) return '';
  ts = ts.trim().toUpperCase();
  const pm = ts.includes('PM') || ts.includes('CH');
  const am = ts.includes('AM') || ts.includes('SA');
  let c = ts.replace(/[^\d:]/g, '');
  const p = c.split(':'); if (!p[0]) return ts;
  let h = parseInt(p[0], 10), m = parseInt(p[1] || '0', 10);
  if (isNaN(h)) return ts; if (isNaN(m)) m = 0; if (pm && h < 12) h += 12; if (am && h === 12) h = 0;
  return String(h % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
}

export function getTripStatus(trip) {
  if (trip.status === 'archived') return 'archived';
  const itin = safeParse(trip.itinerary, []);
  if (itin.length) {
    const c = itin.filter(i => i.status === 'completed' || i.checked).length;
    if (c === itin.length) return 'completed';
    if (c > 0) return 'active';
  }
  return trip.status || 'planning';
}
