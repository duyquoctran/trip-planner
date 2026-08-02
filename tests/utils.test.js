import { describe, expect, it, vi } from 'vitest';
import {
  esc,
  fmtCurrency,
  fmtDate,
  fmtTime24,
  fmtTripDates,
  genId,
  getTripStatus,
  safeParse,
} from '../src/js/utils.js';

describe('utils', () => {
  it('parses JSON with a fallback for empty and invalid values', () => {
    expect(safeParse('{"ok":true}', {})).toEqual({ ok: true });
    expect(safeParse('', ['fallback'])).toEqual(['fallback']);
    expect(safeParse('{bad', { ok: false })).toEqual({ ok: false });
  });

  it('generates stable item id format from time and random parts', () => {
    vi.spyOn(Date, 'now').mockReturnValue(12345);
    vi.spyOn(Math, 'random').mockReturnValue(0.987654);
    expect(genId()).toBe('item_12345_987654');
  });

  it('escapes unsafe HTML characters and quotes', () => {
    expect(esc('<img alt="x">')).toBe('&lt;img alt=&quot;x&quot;&gt;');
  });

  it('formats currency and falls back for invalid values', () => {
    expect(fmtCurrency('1200.5', 'USD')).toBe('$1,200.50');
    expect(fmtCurrency('abc', 'USD')).toBe('\u2014');
    vi.spyOn(Intl, 'NumberFormat').mockImplementation(() => {
      throw new Error('format unavailable');
    });
    expect(fmtCurrency(12, 'USD')).toBe('12 USD');
  });

  it('formats dates and trip date ranges', () => {
    expect(fmtDate('')).toBe('');
    expect(fmtDate('not-a-date')).toBe('not-a-date');
    expect(fmtTripDates('')).toBe('No dates');
    expect(fmtTripDates('2026-01-01')).toContain('2026');
    expect(fmtTripDates('2026-01-01 – 2026-01-03')).toContain('–');
    const OriginalDate = globalThis.Date;
    vi.stubGlobal('Date', class {
      constructor() {
        throw new Error('date unavailable');
      }
    });
    expect(fmtDate('2026-01-01')).toBe('2026-01-01');
    vi.stubGlobal('Date', OriginalDate);
  });

  it('normalizes common time formats to 24-hour time', () => {
    expect(fmtTime24('')).toBe('');
    expect(fmtTime24('9:05 PM')).toBe('21:05');
    expect(fmtTime24('12:05 PM')).toBe('12:05');
    expect(fmtTime24('12:30 AM')).toBe('00:30');
    expect(fmtTime24('7 SA')).toBe('07:00');
    expect(fmtTime24('7 CH')).toBe('19:00');
    expect(fmtTime24('abc')).toBe('ABC');
  });

  it('derives trip status from archived and itinerary state', () => {
    expect(getTripStatus({ status: 'archived', itinerary: '[]' })).toBe('archived');
    expect(getTripStatus({ itinerary: '[{"status":"completed"},{"checked":true}]' })).toBe('completed');
    expect(getTripStatus({ itinerary: '[{"status":"completed"},{"status":"planned"}]' })).toBe('active');
    expect(getTripStatus({ itinerary: '[{"status":"planned"}]' })).toBe('planning');
    expect(getTripStatus({ status: 'planning', itinerary: '[]' })).toBe('planning');
    expect(getTripStatus({ itinerary: '{bad' })).toBe('planning');
  });
});
