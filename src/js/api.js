import { state } from './state.js';

function getDataSdk() {
  return typeof window !== 'undefined' ? window.dataSdk : null;
}

export async function saveTrip(trip) {
  state.lastUpdate = { id: trip.__backendId, ts: Date.now(), data: JSON.parse(JSON.stringify(trip)) };
  const dataSdk = getDataSdk();
  if (!dataSdk || !dataSdk.update) {
    console.warn('dataSdk.update not available');
    return { isError: true };
  }
  const r = await dataSdk.update(trip);
  if (r && r.isError) state.lastUpdate = { id: null, ts: 0, data: null };
  return r;
}

export function initDataSdk(handler) {
  const dataSdk = getDataSdk();
  if (!dataSdk || !dataSdk.init) return Promise.resolve({ isOk: false });
  return dataSdk.init(handler);
}

export function createTrip(data) {
  const dataSdk = getDataSdk();
  if (!dataSdk || !dataSdk.create) return Promise.resolve({ isError: true });
  return dataSdk.create(data);
}

export function deleteTrip(trip) {
  const dataSdk = getDataSdk();
  if (!dataSdk || !dataSdk.delete) return Promise.resolve({ isError: true });
  return dataSdk.delete(trip);
}
