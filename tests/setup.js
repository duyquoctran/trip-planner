import { afterEach, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.body.innerHTML = '';
  delete window.dataSdk;
  delete window.__voyageI18N;
  delete window.lucide;
});
