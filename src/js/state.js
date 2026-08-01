export const state = {
  lang: localStorage.getItem('voyage_planner_lang') || 'en',
  trips: [],
  recordCount: 0,
  currentTrip: null,
  editingTripId: null,
  contextTripId: null,
  duplicateSourceTrip: null,
  packingMember: null,
  packingStage: 'outbound',
  itemModal: { tabType: null, idx: null, group: null },
  isSaving: false,
  lastUpdate: { id: null, ts: 0, data: null }
};

const dom = {};
export function $(id) { if (!dom[id]) dom[id] = document.getElementById(id); return dom[id]; }

export default state;