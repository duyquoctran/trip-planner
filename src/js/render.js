import { $ , state } from './state.js';
import { t } from './i18n.js';
import { esc, GRADIENTS, fmtCurrency, fmtDate, fmtTripDates, fmtTime24 } from './utils.js';
import { getDocs, getBudget, getItin, getMembers, getPacking } from './data.js';

export function renderProgress(containerId, total, done) {
  const c = $(containerId); if (!c) return;
  const p = total > 0 ? Math.round(done / total * 100) : 0;
  c.innerHTML = `<div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span>${t('progress_label')}</span><span>${p}% (${done}/${total})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${p}%"></div></div>`;
}

export function actBtns(idx) { return `<div class="item-actions flex items-center gap-1 flex-shrink-0"><button type="button" class="act-edit p-1 rounded hover:bg-emerald-50" data-idx="${idx}" aria-label="${t('btn_edit')}"><i data-lucide="pencil" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="act-dup p-1 rounded hover:bg-blue-50" data-idx="${idx}" aria-label="${t('btn_duplicate')}"><i data-lucide="copy" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="act-del p-1 rounded hover:bg-red-50" data-idx="${idx}" aria-label="${t('btn_delete')}"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i></button></div>`; }

export function renderTabBar(renderTabFn) {
  const tabs = [{ id: 'documents', key: 'tab_documents' }, { id: 'budget', key: 'tab_budget' }, { id: 'packing', key: 'tab_packing' }, { id: 'itinerary', key: 'tab_itinerary' }];
  const bar = $('tab-bar');
  if (!bar) return;
  bar.innerHTML = tabs.map((td, i) => `<button type="button" class="tab-btn ${i===0?'active':'text-gray-400'} px-4 py-2 text-sm font-medium" data-tab="${td.id}" role="tab" aria-selected="${i===0}" data-i18n="${td.key}">${t(td.key)}</button>`).join('');
}

export function renderBookshelf(renderTripCard, renderArchivedCard) {
  const searchEl = $('search-input');
  const search = searchEl ? searchEl.value.toLowerCase() : '';
  const filter = $('status-filter') ? $('status-filter').value : 'all';
  const sort = $('sort-select') ? $('sort-select').value : 'newest';
  const shelf = $('bookshelf');
  const archivedSection = $('archived-section');
  const archivedShelf = $('archived-bookshelf');
  const carousel = $('carousel-container');
  const summaryEl = $('trip-completed-summary');

  const cc = state.trips.filter(tr => { const it = JSON.parse(tr.itinerary || '[]'); return it.length && it.every(i => i.status === 'completed' || i.checked); }).length;
  if (summaryEl) summaryEl.innerHTML = t('completed_trips_summary').replace('{count}', cc) + ' <i data-lucide="heart" class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block align-middle ml-1"></i>';

  const active = state.trips.filter(x => (x.status || '') !== 'archived');
  const archived = state.trips.filter(x => (x.status || '') === 'archived');
  const matchSearch = x => !search || (x.trip_name || '').toLowerCase().includes(search);
  const sortFn = (a, b) => sort === 'newest' ? (b.created_at || '').localeCompare(a.created_at || '') : sort === 'oldest' ? (a.created_at || '').localeCompare(b.created_at || '') : (a.trip_name || '').localeCompare(b.trip_name || '');

  if (filter === 'archived') {
    if (carousel) carousel.classList.add('hidden');
    if (archivedSection) archivedSection.classList.remove('hidden');
    const filtered = archived.filter(matchSearch).sort(sortFn);
    if (filtered.length) archivedShelf.innerHTML = filtered.map(renderArchivedCard).join('');
    else archivedShelf.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400 text-sm italic">${t('no_archived')}</div>`;
  } else {
    if (archivedSection) archivedSection.classList.add('hidden');
    if (carousel) carousel.classList.remove('hidden');
    let filtered = active.filter(x => { if (!matchSearch(x)) return false; if (filter !== 'all' && (x.status || '') !== filter) return false; return true; }).sort(sortFn);
    const prev = $('carousel-prev'), next = $('carousel-next');
    if (!filtered.length) {
      if (prev) prev.classList.add('opacity-30','pointer-events-none');
      if (next) next.classList.add('opacity-30','pointer-events-none');
      if (shelf) shelf.innerHTML = `<div class="w-72 sm:w-80 h-[218px] rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/10 flex flex-col items-center justify-center text-center p-6 shrink-0 anim-slide-up"><i data-lucide="map" class="w-10 h-10 text-pink-300 mb-3 animate-pulse"></i><p class="text-sm font-medium text-gray-500 px-2">${t('empty_text')}</p></div><div class="w-72 sm:w-80 h-[218px] rounded-2xl border border-dashed border-pink-100 bg-pink-50/5 flex items-center justify-center shrink-0 opacity-60"><i data-lucide="plane" class="w-8 h-8 text-pink-200/50"></i></div>`;
    } else {
      if (prev) prev.classList.remove('opacity-30','pointer-events-none');
      if (next) next.classList.remove('opacity-30','pointer-events-none');
      if (shelf) shelf.innerHTML = filtered.map((x, i) => renderTripCard(x, i)).join('');
    }
  }
  if (window.lucide) window.lucide.createIcons();
}

export function renderTripCard(x, idx) {
  const cover = x.trip_image ? `<img src="${x.trip_image}" class="w-full h-36 object-cover" loading="lazy">` : `<div class="w-full h-36 flex items-center justify-center relative overflow-hidden" style="background:${GRADIENTS[idx%4]}"><i data-lucide="plane" class="w-10 h-10 text-pink-500/60 relative z-10 pointer-events-none"></i></div>`;
  return `<div class="book-spine rounded-2xl overflow-hidden border border-pink-100 bg-white shadow-md text-left anim-slide-up relative group cursor-pointer w-72 sm:w-80 shrink-0 snap-start pulse-card" data-id="${x.__backendId}"><div class="relative">${cover}<button type="button" class="menu-btn absolute top-2 right-2 p-2 rounded-full bg-white border border-pink-200 shadow-md z-30 hover:bg-pink-50 transition-colors" data-id="${x.__backendId}" aria-label="${t('card_menu_tooltip')}"><i data-lucide="more-vertical" class="w-4 h-4 text-gray-700 pointer-events-none"></i></button></div><div class="p-3"><h3 class="font-display font-bold text-gray-800 text-sm leading-tight">${esc(x.trip_name || t('untitled'))}</h3><p class="text-xs text-gray-400 mt-1">${fmtTripDates(x.trip_dates)}</p></div></div>`;
}

export function renderArchivedCard(x) {
  const cover = x.trip_image ? `<img src="${x.trip_image}" class="w-full h-36 object-cover opacity-60 grayscale" loading="lazy">` : `<div class="w-full h-36 flex items-center justify-center bg-gray-100"><i data-lucide="archive" class="w-10 h-10 text-gray-400 pointer-events-none"></i></div>`;
  return `<div class="book-spine rounded-2xl overflow-hidden border border-gray-200 bg-gray-50/85 shadow-sm text-left anim-slide-up relative group cursor-pointer opacity-75" data-id="${x.__backendId}"><div class="relative">${cover}<button type="button" class="menu-btn absolute top-2 right-2 p-2 rounded-full bg-white border border-gray-200 shadow-md z-30 hover:bg-gray-100 transition-colors" data-id="${x.__backendId}" aria-label="${t('card_menu_tooltip')}"><i data-lucide="more-vertical" class="w-4 h-4 text-gray-500 pointer-events-none"></i></button><span class="absolute bottom-2 left-2 px-2 py-0.5 bg-gray-800/70 text-white rounded text-[10px] uppercase font-semibold tracking-wider">${t('filter_archived')}</span></div><div class="p-3"><h3 class="font-display font-bold text-gray-500 text-sm leading-tight line-through">${esc(x.trip_name || t('untitled'))}</h3><p class="text-xs text-gray-400 mt-1">${fmtTripDates(x.trip_dates)}</p></div></div>`;
}

export function renderDetail() {
  if (!state.currentTrip) return;
  const nameEl = $('detail-trip-name'); if (nameEl) nameEl.textContent = state.currentTrip.trip_name || t('untitled');
  renderDocs(); renderBudget(); renderMembers(); renderPacking(); renderItin();
}

export function renderDocs() {
  const docs = getDocs(state.currentTrip);
  const done = docs.filter(d => d.status === 'done' || d.checked).length;
  renderProgress('doc-progress-container', docs.length, done);
  const el = $('doc-list'); if (!el) return;
  if (!docs.length) { el.innerHTML = `<p class="text-sm text-gray-400 italic text-center py-4">${t('no_documents')}</p>`; return; }
  el.innerHTML = docs.map((d, i) => { const st = d.status || (d.checked ? 'done' : 'draft'); const isDone = st === 'done'; return `<div class="checklist-row flex items-start gap-3 p-3 rounded-lg ${isDone ? 'checked-row' : ''}" data-idx="${i}"><button type="button" class="doc-check mt-0.5 w-5 h-5 rounded-full border-2 ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle done">${isDone ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}</button><div class="flex-1 min-w-0"><span class="cl-text text-sm text-gray-800">${esc(d.name || '')}</span><div class="flex flex-wrap gap-3 mt-1 text-xs text-gray-400 items-center"><span class="status-badge bg-emerald-50 text-emerald-700">${t('status_' + st)}</span>${d.cost ? '<span class="text-amber-600 font-medium">' + esc(d.cost) + '</span>' : ''}${d.pic ? '<span>' + esc(d.pic) + '</span>' : ''}${d.start_date || d.end_date ? '<span>' + fmtDate(d.start_date) + (d.end_date ? ' – ' + fmtDate(d.end_date) : '') + '</span>' : ''}${d.notes ? '<span class="italic">' + esc(d.notes) + '</span>' : ''}</div></div>${actBtns(i)}</div>`; }).join('');
  if (window.lucide) window.lucide.createIcons();
}

export function renderBudget() {
  const budget = getBudget(state.currentTrip);
  const paid = budget.filter(b => b.status === 'paid' || b.paid).length;
  renderProgress('budget-progress-container', budget.length, paid);
  const el = $('budget-body'); const sumEl = $('budget-summary'); if (!el) return;
  if (!budget.length) { el.innerHTML = `<tr><td colspan="6" class="text-center text-gray-400 text-sm py-4 italic">${t('no_budget')}</td></tr>`; if (sumEl) sumEl.innerHTML = ''; return; }
  el.innerHTML = budget.map((b, i) => { const st = b.status || (b.paid ? 'paid' : 'unpaid'); const isPaid = st === 'paid'; const cur = b.currency || 'VND'; return `<tr class="border-t border-pink-50 budget-row hover:bg-pink-50/30" data-idx="${i}"><td class="px-4 py-2">${esc(b.name || '')}</td><td class="px-4 py-2 text-right font-medium">${fmtCurrency(b.cost, cur)}</td><td class="px-4 py-2 text-center text-xs font-semibold text-gray-500">${cur}</td><td class="px-4 py-2 text-center"><button type="button" class="budget-check-btn px-2.5 py-1 rounded-full text-xs font-semibold ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'} transition-colors" data-idx="${i}">${t('status_' + st)}</button></td><td class="px-4 py-2 text-xs text-gray-400 italic max-w-[150px] truncate">${esc(b.note || '')}${b.link ? ` <a href="${esc(b.link)}" target="_blank" rel="noopener noreferrer" class="text-emerald-500 underline">🔗</a>` : ''}</td><td class="px-2 py-2">${actBtns(i)}</td></tr>`; }).join('');
  const totals = {}, paidTotals = {};
  budget.forEach(b => { const cur = b.currency || 'VND'; const n = parseFloat(String(b.cost || '0').replace(/[^\d.-]/g, '')) || 0; totals[cur] = (totals[cur] || 0) + n; if (b.status === 'paid' || (!b.status && b.paid)) paidTotals[cur] = (paidTotals[cur] || 0) + n; });
  if (sumEl) sumEl.innerHTML = Object.keys(totals).map(cur => `<div class="mt-1">${t('total')} (${cur}): <strong>${fmtCurrency(totals[cur], cur)}</strong> <span class="mx-2">|</span> ${t('paid_total')}: <strong class="text-emerald-600">${fmtCurrency(paidTotals[cur] || 0, cur)}</strong></div>`).join('');
  if (window.lucide) window.lucide.createIcons();
}

export function renderMembers() {
  const members = getMembers(state.currentTrip);
  if (!state.packingMember || !members.includes(state.packingMember)) state.packingMember = members[0] || null;
  const c = $('members-container'); if (!c) return;
  c.innerHTML = members.map(m => `<span class="member-chip ${m===state.packingMember?'active':''}" data-member="${esc(m)}"><span class="member-name-text">${esc(m)}</span><span class="member-remove" title="${t('remove_member')}">×</span></span>`).join('') + `<button type="button" class="member-chip add-member-chip" style="border:2px dashed #d1d5db;color:#6b7280" aria-label="${t('add_member')}"><i data-lucide="user-plus" class="w-3.5 h-3.5"></i></button>`;
  if (window.lucide) window.lucide.createIcons();
}

export function renderPacking() {
  const packing = getPacking(state.currentTrip);
  const md = packing[state.packingMember] || { outbound: {}, return: {} };
  const count = (stage) => { let t = 0, d = 0; Object.values(md[stage] || {}).forEach(items => { if (Array.isArray(items)) { t += items.length; d += items.filter(i => i.status === 'packed' || i.checked).length; } }); return { t, d }; };
  const out = count('outbound'), ret = count('return');
  const pc = $('packing-progress-container'); if (!pc) return;
  const pctO = out.t ? Math.round(out.d / out.t * 100) : 0; const pctR = ret.t ? Math.round(ret.d / ret.t * 100) : 0;
  pc.innerHTML = `<div class="p-3 bg-pink-50/20 rounded-xl border border-pink-100/50"><div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span class="flex items-center gap-1"><i data-lucide="plane-takeoff" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('tab_packing_outbound')}</span><span>${pctO}% (${out.d}/${out.t})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${pctO}%"></div></div></div><div class="p-3 bg-pink-50/20 rounded-xl border border-pink-100/50"><div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-medium"><span class="flex items-center gap-1"><i data-lucide="plane-landing" class="w-3.5 h-3.5 text-emerald-600"></i> ${t('tab_packing_return')}</span><span>${pctR}% (${ret.d}/${ret.t})</span></div><div class="w-full h-2 rounded-full bg-gray-100 overflow-hidden border border-pink-50"><div class="h-full rounded-full bg-gradient-to-r from-pink-300 to-emerald-400 transition-all duration-300" style="width:${pctR}%"></div></div></div>`;

  const activeData = md[state.packingStage] || {};
  const hasItems = Object.keys(activeData).length > 0;
  const banner = $('packing-copy-banner'); const outHas = Object.keys(md.outbound || {}).length > 0;
  if (state.packingStage === 'return' && !hasItems && outHas) banner && banner.classList.remove('hidden'); else banner && banner.classList.add('hidden');

  const el = $('packing-list-container'); if (!el) return;
  if (!state.packingMember) { el.innerHTML = `<p class="text-sm text-gray-400 italic text-center py-4">${t('no_packing')}</p>`; if (window.lucide) window.lucide.createIcons(); return; }
  if (!hasItems) { el.innerHTML = `<p class="text-sm text-gray-400 italic text-center py-4">${t('no_packing_stage')}</p>`; if (window.lucide) window.lucide.createIcons(); return; }
  el.innerHTML = Object.entries(activeData).map(([group, items]) => `<div class="mb-5"><h4 class="text-xs uppercase tracking-wider text-emerald-600 font-semibold mb-2 flex items-center gap-1"><i data-lucide="tag" class="w-3 h-3"></i> ${esc(group)}</h4><div class="space-y-1">${items.map((it, i) => { const st = it.status || (it.checked ? 'packed' : 'not_started'); const packed = st === 'packed'; return `<div class="checklist-row flex items-center gap-3 p-2 rounded-lg ${packed ? 'checked-row' : ''}" data-group="${esc(group)}" data-idx="${i}"><button type="button" class="pack-check-btn w-5 h-5 rounded-full border-2 ${packed ? 'bg-emerald-500 border-emerald-500' : 'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle packed">${packed ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}</button><span class="cl-text text-sm text-gray-700 flex-1">${esc(it.item || '')}</span><span class="status-badge bg-pink-50 text-pink-700 mr-2">${t('status_' + st)}</span>${it.note ? '<span class="text-xs text-amber-500 italic mr-2">' + esc(it.note) + '</span>' : ''}<div class="item-actions flex items-center gap-1 flex-shrink-0"><button type="button" class="pack-edit p-1 rounded hover:bg-emerald-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_edit')}"><i data-lucide="pencil" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="pack-dup p-1 rounded hover:bg-blue-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_duplicate')}"><i data-lucide="copy" class="w-3.5 h-3.5 text-gray-400"></i></button><button type="button" class="pack-del p-1 rounded hover:bg-red-50" data-group="${esc(group)}" data-idx="${i}" aria-label="${t('btn_delete')}"><i data-lucide="trash-2" class="w-3.5 h-3.5 text-red-400"></i></button></div></div>`; }).join('')}</div></div>`).join('');
  if (window.lucide) window.lucide.createIcons();
}

export function renderItin() {
  const itin = getItin(state.currentTrip);
  const done = itin.filter(x => x.status === 'completed' || x.checked).length;
  renderProgress('itinerary-progress-container', itin.length, done);
  const el = $('itinerary-content'); if (!el) return;
  if (!itin.length) { el.innerHTML = `<p class="text-sm text-gray-400 italic text-center py-8">${t('no_itinerary')}</p>`; return; }
  el.innerHTML = itin.map((x, i) => { const st = x.status || (x.checked ? 'completed' : 'planned'); const isC = st === 'completed'; return `<div class="itin-row border border-emerald-100 rounded-xl p-4 flex items-start gap-3 hover:border-emerald-300 transition-colors ${isC ? 'checked-row bg-emerald-50/10' : ''}" data-idx="${i}"><button type="button" class="itin-check-btn mt-1 w-5 h-5 rounded border-2 ${isC ? 'bg-emerald-500 border-emerald-500' : 'border-pink-300'} flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Toggle completed">${isC ? '<i data-lucide="check" class="w-3 h-3 text-white"></i>' : ''}</button><div class="flex-shrink-0 w-20 text-center"><div class="text-xs font-semibold text-emerald-600">${fmtDate(x.date)}</div><div class="text-xs text-gray-400">${fmtTime24(x.time)}</div></div><div class="flex-1 min-w-0"><div class="font-medium text-sm text-gray-800">${esc(x.title || '')}</div>${x.location ? '<div class="text-xs text-gray-400 mt-0.5">📍 ' + esc(x.location) + '</div>' : ''}${x.notes ? '<div class="text-xs text-gray-400 mt-1 italic">' + esc(x.notes) + '</div>' : ''}</div><span class="status-badge bg-emerald-50 text-emerald-600">${t('status_' + st)}</span>${actBtns(i)}</div>`; }).join('');
  if (window.lucide) window.lucide.createIcons();
}
