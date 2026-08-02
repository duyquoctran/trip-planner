import { describe, expect, it, vi } from 'vitest';
import { t } from '../src/js/i18n.js';
import { $, getInitialLang, state } from '../src/js/state.js';

describe('state and i18n', () => {
  it('reads translations from the active language and falls back to English or key', () => {
    window.__voyageI18N = {
      en: { hello: 'Hello', only_en: 'Only English' },
      vi: { hello: 'Xin chao' },
    };
    state.lang = 'vi';
    expect(t('hello')).toBe('Xin chao');
    expect(t('only_en')).toBe('Only English');
    expect(t('missing')).toBe('missing');
  });

  it('returns key when translations are unavailable', () => {
    state.lang = 'en';
    expect(t('anything')).toBe('anything');
  });

  it('returns key outside a browser window', () => {
    const originalWindow = window;
    vi.stubGlobal('window', undefined);
    expect(t('anything')).toBe('anything');
    vi.stubGlobal('window', originalWindow);
  });

  it('caches document element lookups by id', () => {
    document.body.innerHTML = '<div id="target"></div>';
    const spy = vi.spyOn(document, 'getElementById');
    expect($('target')).toBe(document.querySelector('#target'));
    expect($('target')).toBe(document.querySelector('#target'));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('falls back to English for missing or broken storage', () => {
    expect(getInitialLang(null)).toBe('en');
    expect(getInitialLang({ getItem: () => '' })).toBe('en');
    expect(getInitialLang({ getItem: () => 'vi' })).toBe('vi');
    expect(getInitialLang({ getItem: () => { throw new Error('denied'); } })).toBe('en');
  });

  it('returns null for DOM lookup outside a document', () => {
    const originalDocument = document;
    vi.stubGlobal('document', undefined);
    expect($('missing')).toBeNull();
    vi.stubGlobal('document', originalDocument);
  });
});
