export function getInitialLang(storage = globalThis.localStorage) {
  try {
    if (!storage) return 'en';
    return storage.getItem('voyage_planner_lang') || 'en';
  } catch (err) {
    return 'en';
  }
}

export const state = {
  lang: getInitialLang(),
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
export function $(id) {
  if (typeof document === 'undefined') {
    return null;
  }
  if (!dom[id] || !dom[id].isConnected) dom[id] = document.getElementById(id);
  return dom[id];
}

export default state;
