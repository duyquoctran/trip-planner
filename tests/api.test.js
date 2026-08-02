import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTrip, deleteTrip, initDataSdk, saveTrip } from '../src/js/api.js';
import { state } from '../src/js/state.js';

describe('api adapter', () => {
  beforeEach(() => {
    state.lastUpdate = { id: null, ts: 0, data: null };
  });

  it('returns failure shapes when dataSdk is unavailable', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await expect(initDataSdk({})).resolves.toEqual({ isOk: false });
    await expect(createTrip({})).resolves.toEqual({ isError: true });
    await expect(deleteTrip({})).resolves.toEqual({ isError: true });
    await expect(saveTrip({ __backendId: '1', trip_name: 'Demo' })).resolves.toEqual({ isError: true });
    expect(warn).toHaveBeenCalledWith('dataSdk.update not available');
  });

  it('returns failure shapes when dataSdk methods are missing', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.dataSdk = {};
    await expect(initDataSdk({})).resolves.toEqual({ isOk: false });
    await expect(createTrip({})).resolves.toEqual({ isError: true });
    await expect(deleteTrip({})).resolves.toEqual({ isError: true });
    await expect(saveTrip({ __backendId: '1' })).resolves.toEqual({ isError: true });
    expect(warn).toHaveBeenCalledWith('dataSdk.update not available');
  });

  it('handles non-browser environments without window', async () => {
    const originalWindow = window;
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('window', undefined);
    await expect(createTrip({})).resolves.toEqual({ isError: true });
    await expect(saveTrip({ __backendId: '1' })).resolves.toEqual({ isError: true });
    expect(warn).toHaveBeenCalledWith('dataSdk.update not available');
    vi.stubGlobal('window', originalWindow);
  });

  it('delegates create, delete, and init to dataSdk', async () => {
    const handler = {};
    const trip = { __backendId: '1' };
    window.dataSdk = {
      init: vi.fn().mockResolvedValue({ isOk: true }),
      create: vi.fn().mockResolvedValue({ isOk: true }),
      delete: vi.fn().mockResolvedValue({ isOk: true }),
    };
    await expect(initDataSdk(handler)).resolves.toEqual({ isOk: true });
    await expect(createTrip(trip)).resolves.toEqual({ isOk: true });
    await expect(deleteTrip(trip)).resolves.toEqual({ isOk: true });
    expect(window.dataSdk.init).toHaveBeenCalledWith(handler);
    expect(window.dataSdk.create).toHaveBeenCalledWith(trip);
    expect(window.dataSdk.delete).toHaveBeenCalledWith(trip);
  });

  it('stores last update data on save success', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(500);
    const trip = { __backendId: '1', trip_name: 'Demo' };
    window.dataSdk = { update: vi.fn().mockResolvedValue({ isOk: true }) };
    await expect(saveTrip(trip)).resolves.toEqual({ isOk: true });
    expect(state.lastUpdate).toEqual({ id: '1', ts: 500, data: trip });
  });

  it('clears optimistic update state on save error', async () => {
    window.dataSdk = { update: vi.fn().mockResolvedValue({ isError: true }) };
    await expect(saveTrip({ __backendId: '1' })).resolves.toEqual({ isError: true });
    expect(state.lastUpdate).toEqual({ id: null, ts: 0, data: null });
  });
});
