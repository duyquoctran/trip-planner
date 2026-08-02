export function safeParse(s, fb) {
  try {
    return JSON.parse(s || JSON.stringify(fb));
  } catch (e) {
    return fb;
  }
}

export function genId() {
  return 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
}

export function esc(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const GRADIENTS = [
  'linear-gradient(135deg,#fbcfe8 0%,#ccfbf1 100%)',
  'linear-gradient(135deg,#fef3c7 0%,#fbcfe8 100%)',
  'linear-gradient(135deg,#ccfbf1 0%,#fdba74 100%)',
  'linear-gradient(135deg,#e0f2fe 0%,#fbcfe8 100%)',
];

export function fmtCurrency(v, cur) {
  const n = parseFloat(String(v).replace(/[^\d.-]/g, ''));
  if (isNaN(n)) return '\u2014';
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur }).format(n);
  } catch (e) {
    return n.toLocaleString() + ' ' + cur;
  }
}

export function fmtDate(s) {
  if (!s) return '';
  try {
    const d = new Date(s);
    if (isNaN(d)) return s;
    return d.toLocaleDateString();
  } catch (e) {
    return s;
  }
}

export function fmtTripDates(s) {
  if (!s) return 'No dates';
  const p = s.split(' – ');
  return p.length === 2 ? fmtDate(p[0]) + ' – ' + fmtDate(p[1]) : fmtDate(s);
}

export function fmtTime24(ts) {
  if (!ts) return '';
  const normalized = ts.trim().toUpperCase();
  const pm = normalized.includes('PM') || normalized.includes('CH');
  const am = normalized.includes('AM') || normalized.includes('SA');
  const cleaned = normalized.replace(/[^\d:]/g, '');
  const parts = cleaned.split(':');
  if (!parts[0]) return normalized;

  let hours = parseInt(parts[0], 10);
  let minutes = parseInt(parts[1] || '0', 10);
  if (pm && hours < 12) hours += 12;
  if (am && hours === 12) hours = 0;

  return String(hours % 24).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
}

export function getTripStatus(trip) {
  if (trip.status === 'archived') return 'archived';
  const itin = safeParse(trip.itinerary, []);
  if (itin.length) {
    const completed = itin.filter(item => item.status === 'completed' || item.checked).length;
    if (completed === itin.length) return 'completed';
    if (completed > 0) return 'active';
  }
  return trip.status || 'planning';
}
