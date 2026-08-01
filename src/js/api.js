import { state } from './state.js';

export async function saveTrip(trip) {
  state.lastUpdate = { id: trip.__backendId, ts: Date.now(), data: JSON.parse(JSON.stringify(trip)) };
  if (!window.dataSdk || !window.dataSdk.update) {
    console.warn('dataSdk.update not available');
    return { isError: true };
  }
  const r = await window.dataSdk.update(trip);
  if (r && r.isError) state.lastUpdate = { id: null, ts: 0, data: null };
  return r;
}

export function initDataSdk(handler) {
  if (!window.dataSdk || !window.dataSdk.init) return Promise.resolve({ isOk: false });
  return window.dataSdk.init(handler);
}

export function createTrip(data) {
  if (!window.dataSdk || !window.dataSdk.create) return Promise.resolve({ isError: true });
  return window.dataSdk.create(data);
}

export function deleteTrip(trip) {
  if (!window.dataSdk || !window.dataSdk.delete) return Promise.resolve({ isError: true });
  return window.dataSdk.delete(trip);
}
