import { state } from './state.js';

export const I18N = { /* minimal: original I18N is large; bootstrap will import it from app if needed */ };

// Note: The full I18N object is defined in the original app.js. To avoid duplication, modules can import the I18N
// from the main bundle or we can keep accessing localized strings via a t() function that references a shared I18N object.

// For now, export a t() that expects an I18N object to be attached to window.__voyageI18N if present.
export function t(k) {
  const dict = (window.__voyageI18N && window.__voyageI18N[state.lang]) || (window.__voyageI18N && window.__voyageI18N['en']) || {};
  return dict[k] || k;
}

export default { I18N, t };