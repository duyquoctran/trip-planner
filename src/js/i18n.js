import { state } from './state.js';

export const I18N = { /* minimal: original I18N is large; bootstrap will import it from app if needed */ };

// Note: The full I18N object is defined in the original app.js. To avoid duplication, modules can import the I18N
// from the main bundle or we can keep accessing localized strings via a t() function that references a shared I18N object.

// For now, export a t() that expects an I18N object to be attached to window.__voyageI18N if present.
export function t(k) {
  const source = typeof window !== 'undefined' ? window.__voyageI18N : null;
  const dict = (source && source[state.lang]) || {};
  const fallback = (source && source.en) || {};
  return dict[k] || fallback[k] || k;
}

export default { I18N, t };
