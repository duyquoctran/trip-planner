import { beforeEach, describe, expect, it, vi } from 'vitest';
import { state } from '../src/js/state.js';
import {
  actBtns,
  renderArchivedCard,
  renderBookshelf,
  renderBudget,
  renderDetail,
  renderDocs,
  renderItin,
  renderMembers,
  renderPacking,
  renderProgress,
  renderTabBar,
  renderTripCard,
} from '../src/js/render.js';

function installDom() {
  document.body.innerHTML = `
    <input id="search-input" value="">
    <select id="status-filter"><option value="all" selected>All</option></select>
    <select id="sort-select"><option value="newest" selected>Newest</option></select>
    <div id="tab-bar"></div>
    <div id="bookshelf"></div>
    <div id="archived-section" class="hidden"></div>
    <div id="archived-bookshelf"></div>
    <div id="carousel-container"></div>
    <div id="trip-completed-summary"></div>
    <button id="carousel-prev"></button>
    <button id="carousel-next"></button>
    <h1 id="detail-trip-name"></h1>
    <div id="doc-progress-container"></div>
    <div id="doc-list"></div>
    <div id="budget-progress-container"></div>
    <table><tbody id="budget-body"></tbody></table>
    <div id="budget-summary"></div>
    <div id="members-container"></div>
    <div id="packing-progress-container"></div>
    <div id="packing-copy-banner" class="hidden"></div>
    <div id="packing-list-container"></div>
    <div id="itinerary-progress-container"></div>
    <div id="itinerary-content"></div>
  `;
}

function setTranslations() {
  window.__voyageI18N = {
    en: {
      add_member: 'Add member',
      btn_delete: 'Delete',
      btn_duplicate: 'Duplicate',
      btn_edit: 'Edit',
      card_menu_tooltip: 'Options',
      completed_trips_summary: 'Completed {count}',
      empty_text: 'Empty',
      filter_archived: 'Archived',
      no_archived: 'No archived',
      no_budget: 'No budget',
      no_documents: 'No documents',
      no_itinerary: 'No itinerary',
      no_packing: 'No packing',
      no_packing_stage: 'No packing stage',
      paid_total: 'Paid',
      progress_label: 'Progress',
      remove_member: 'Remove member',
      status_done: 'Done',
      status_draft: 'Draft',
      status_packed: 'Packed',
      status_paid: 'Paid',
      status_planned: 'Planned',
      status_unpaid: 'Unpaid',
      tab_budget: 'Budget',
      tab_documents: 'Documents',
      tab_itinerary: 'Itinerary',
      tab_packing: 'Packing',
      tab_packing_outbound: 'Outbound',
      tab_packing_return: 'Return',
      total: 'Total',
      untitled: 'Untitled',
    },
  };
}

function fullTrip(overrides = {}) {
  return {
    __backendId: 'a',
    trip_name: 'Alpha',
    trip_dates: '2026-01-01 – 2026-01-03',
    trip_image: '',
    status: 'planning',
    created_at: '2026-01-01',
    documents: JSON.stringify([{ name: 'Passport', status: 'done', cost: '$10', pic: 'Duy', start_date: '2026-01-01', end_date: '2026-01-02', notes: 'Bring copy' }]),
    budget: JSON.stringify([{ name: 'Hotel', cost: '100', currency: 'USD', status: 'paid', note: 'Prepaid', link: 'https://example.com' }]),
    itinerary: JSON.stringify([{ title: 'Fly', date: '2026-01-01', time: '9 PM', location: 'Airport', notes: 'Window seat', status: 'completed' }]),
    members: JSON.stringify(['Duy']),
    packing: JSON.stringify({ Duy: { outbound: { Clothes: [{ item: 'Shirt', note: 'Blue', status: 'packed' }] }, return: {} } }),
    ...overrides,
  };
}

describe('render integration', () => {
  beforeEach(() => {
    installDom();
    setTranslations();
    window.lucide = { createIcons: vi.fn() };
    state.lang = 'en';
    state.packingMember = 'Duy';
    state.packingStage = 'outbound';
    state.currentTrip = fullTrip();
    state.trips = [state.currentTrip];
  });

  it('renders progress, tabs, action buttons, cards, and full detail sections', () => {
    renderProgress('doc-progress-container', 2, 1);
    renderTabBar();
    renderBookshelf(
      trip => `<article data-id="${trip.__backendId}">${trip.trip_name}</article>`,
      trip => `<article data-id="${trip.__backendId}">${trip.trip_name}</article>`,
    );
    renderDetail();

    expect(document.querySelector('#doc-progress-container').textContent).toContain('100%');
    expect(document.querySelector('#tab-bar').textContent).toContain('Documents');
    expect(actBtns(2)).toContain('data-idx="2"');
    expect(renderTripCard(fullTrip({ trip_image: 'cover.jpg' }), 0)).toContain('cover.jpg');
    expect(renderTripCard(fullTrip({ trip_name: '' }), 1)).toContain('Untitled');
    expect(renderArchivedCard(fullTrip({ trip_image: 'old.jpg' }))).toContain('old.jpg');
    expect(renderArchivedCard(fullTrip({ trip_name: '' }))).toContain('Archived');
    expect(document.querySelector('#bookshelf').textContent).toContain('Alpha');
    expect(document.querySelector('#detail-trip-name').textContent).toBe('Alpha');
    expect(document.querySelector('#doc-list').textContent).toContain('Passport');
    expect(document.querySelector('#budget-body').textContent).toContain('Hotel');
    expect(document.querySelector('#members-container').textContent).toContain('Duy');
    expect(document.querySelector('#packing-list-container').textContent).toContain('Shirt');
    expect(document.querySelector('#itinerary-content').textContent).toContain('Fly');
    expect(window.lucide.createIcons).toHaveBeenCalled();
  });

  it('renders empty states and archived bookshelf filtering', () => {
    state.currentTrip = fullTrip({
      documents: '[]',
      budget: '[]',
      itinerary: '[]',
      packing: '{}',
      members: '[]',
    });
    state.packingMember = null;
    document.querySelector('#status-filter').innerHTML = '<option value="archived" selected>Archived</option>';
    state.trips = [fullTrip({ __backendId: 'z', status: 'archived', trip_name: 'Old', created_at: '2026-01-02' })];

    renderBookshelf(
      trip => `<article>${trip.trip_name}</article>`,
      trip => `<article>${trip.trip_name}</article>`,
    );
    renderDocs();
    renderBudget();
    renderMembers();
    renderPacking();
    renderItin();

    expect(document.querySelector('#archived-bookshelf').textContent).toContain('Old');
    expect(document.querySelector('#doc-list').textContent).toContain('No documents');
    expect(document.querySelector('#budget-body').textContent).toContain('No budget');
    expect(document.querySelector('#packing-list-container').textContent).toContain('No packing');
    expect(document.querySelector('#itinerary-content').textContent).toContain('No itinerary');
  });

  it('renders no-result and return-stage packing banner branches', () => {
    document.querySelector('#search-input').value = 'missing';
    renderBookshelf(
      trip => `<article>${trip.trip_name}</article>`,
      trip => `<article>${trip.trip_name}</article>`,
    );
    expect(document.querySelector('#bookshelf').textContent).toContain('Empty');

    state.currentTrip = fullTrip();
    state.packingStage = 'return';
    renderPacking();
    expect(document.querySelector('#packing-copy-banner').classList.contains('hidden')).toBe(false);
    expect(document.querySelector('#packing-list-container').textContent).toContain('No packing stage');
  });

  it('renders archived empty state when no archived trip matches', () => {
    document.querySelector('#status-filter').innerHTML = '<option value="archived" selected>Archived</option>';
    document.querySelector('#search-input').value = 'none';
    state.trips = [fullTrip({ status: 'archived', trip_name: 'Old' })];
    renderBookshelf(
      trip => `<article>${trip.trip_name}</article>`,
      trip => `<article>${trip.trip_name}</article>`,
    );
    expect(document.querySelector('#archived-bookshelf').textContent).toContain('No archived');
  });

  it('sorts active trips by oldest and by name', () => {
    state.trips = [
      fullTrip({ __backendId: 'b', trip_name: 'Beta', created_at: '2026-01-02' }),
      fullTrip({ __backendId: 'a', trip_name: 'Alpha', created_at: '2026-01-01' }),
    ];
    document.querySelector('#sort-select').innerHTML = '<option value="oldest" selected>Oldest</option>';
    renderBookshelf(
      trip => `<article>${trip.trip_name}</article>`,
      trip => `<article>${trip.trip_name}</article>`,
    );
    expect(document.querySelector('#bookshelf').textContent.indexOf('Alpha')).toBeLessThan(document.querySelector('#bookshelf').textContent.indexOf('Beta'));

    document.querySelector('#sort-select').innerHTML = '<option value="name" selected>Name</option>';
    renderBookshelf(
      trip => `<article>${trip.trip_name}</article>`,
      trip => `<article>${trip.trip_name}</article>`,
    );
    expect(document.querySelector('#bookshelf').textContent.indexOf('Alpha')).toBeLessThan(document.querySelector('#bookshelf').textContent.indexOf('Beta'));
  });

  it('does nothing when optional render targets are absent', () => {
    document.body.innerHTML = '';
    state.currentTrip = null;
    expect(() => {
      renderProgress('missing', 1, 1);
      renderTabBar();
      renderBookshelf(() => '', () => '');
      renderDetail();
      renderDocs();
      renderBudget();
      renderMembers();
      renderPacking();
      renderItin();
    }).not.toThrow();
  });
});
