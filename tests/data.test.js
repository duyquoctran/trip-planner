import { describe, expect, it, vi } from 'vitest';
import { dedup, getBudget, getDocs, getItin, getMembers, getPacking } from '../src/js/data.js';

describe('data helpers', () => {
  it('deduplicates by id or derived key and assigns missing ids', () => {
    vi.spyOn(Date, 'now').mockReturnValue(10);
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const result = dedup(
      [{ name: 'Passport' }, { name: 'passport' }, { id: 'same', name: 'Visa' }, { id: 'same', name: 'Ticket' }],
      item => item.name.toLowerCase(),
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('item_10_250000');
    expect(result[1].name).toBe('Visa');
  });

  it('returns empty arrays for missing trip sections', () => {
    expect(getDocs(null)).toEqual([]);
    expect(getBudget(null)).toEqual([]);
    expect(getItin(null)).toEqual([]);
  });

  it('normalizes document, budget, and itinerary lists back onto the trip', () => {
    const trip = {
      documents: JSON.stringify([{ name: 'A' }, { name: ' a ' }, {}]),
      budget: JSON.stringify([{ name: 'Hotel' }, { name: 'hotel' }, {}]),
      itinerary: JSON.stringify([{ title: 'Fly', date: '2026-01-01', time: '09:00' }, { title: ' fly ', date: '2026-01-01', time: '09:00' }, {}]),
    };
    expect(getDocs(trip)).toHaveLength(2);
    expect(getBudget(trip)).toHaveLength(2);
    expect(getItin(trip)).toHaveLength(2);
    expect(JSON.parse(trip.documents)).toHaveLength(2);
    expect(JSON.parse(trip.budget)).toHaveLength(2);
    expect(JSON.parse(trip.itinerary)).toHaveLength(2);
  });

  it('returns saved members or the default pair', () => {
    expect(getMembers(null)).toEqual(['Duy', 'Vy']);
    expect(getMembers({ members: '["A","B"]' })).toEqual(['A', 'B']);
    expect(getMembers({ members: '{bad' })).toEqual(['Duy', 'Vy']);
  });

  it('normalizes packing by member, stage, category, id, and item key', () => {
    expect(getPacking(null)).toEqual({});
    const trip = {
      packing: JSON.stringify({
        Duy: {
          outbound: {
            Clothes: [
              { id: 'shirt-1', item: 'Shirt' },
              { item: 'shirt' },
              { id: 'shirt-1', item: 'Pants' },
            ],
            Ignored: 'not-array',
          },
          return: {
            Clothes: [{ item: 'Laundry', checked: true }],
          },
        },
        Vy: {
          Toiletries: [{ item: 'Brush' }],
        },
      }),
    };
    const packing = getPacking(trip);
    expect(packing.Duy.outbound.Clothes).toHaveLength(1);
    expect(packing.Duy.return.Clothes).toHaveLength(1);
    expect(packing.Vy.outbound.Toiletries).toHaveLength(1);
    expect(packing.Vy.return.Toiletries).toHaveLength(1);
  });

  it('returns empty packing for invalid JSON', () => {
    expect(getPacking({ packing: '{bad' })).toEqual({});
  });

  it('ignores non-object member packing and empty categories', () => {
    const trip = {
      packing: JSON.stringify({
        Duy: null,
        Vy: { outbound: { Empty: [], Misc: [{ note: 'missing item' }] }, return: 'ignored' },
        An: { outbound: { Gear: [{ item: 'Hat' }] } },
      }),
    };
    expect(getPacking(trip)).toEqual({
      Duy: { outbound: {}, return: {} },
      Vy: { outbound: { Misc: [{ id: expect.any(String), note: 'missing item' }] }, return: {} },
      An: { outbound: { Gear: [{ id: expect.any(String), item: 'Hat' }] }, return: {} },
    });
  });
});
