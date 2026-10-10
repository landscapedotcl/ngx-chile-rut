import { rutCheckDigit, rutClean, rutFormat, rutValidate } from './rut-helpers';

describe('rut-helpers', () => {
  describe('rutClean', () => {
    it('removes dots, dashes and spaces', () => {
      expect(rutClean('7.618.285-K')).toBe('7618285K');
      expect(rutClean(' 11 111 111 - 1 ')).toBe('111111111');
    });

    it('upper-cases the check digit', () => {
      expect(rutClean('7618285-k')).toBe('7618285K');
    });

    it('strips leading zeros', () => {
      expect(rutClean('007.618.285-K')).toBe('7618285K');
    });

    it('accepts numbers', () => {
      expect(rutClean(111111111)).toBe('111111111');
    });

    it('returns an empty string for non string values', () => {
      expect(rutClean(null)).toBe('');
      expect(rutClean(undefined)).toBe('');
      expect(rutClean({})).toBe('');
    });
  });

  describe('rutCheckDigit', () => {
    const cases: Array<[string, string]> = [
      ['7618285', 'K'],
      ['11111111', '1'],
      ['1111111', '4'],
      ['12345678', '5'],
      ['24965101', 'K'],
      ['10000000', '8'],
      ['1', '9'],
    ];
    cases.forEach(([body, dv]) => {
      it(`${body} → ${dv}`, () => {
        expect(rutCheckDigit(body)).toBe(dv);
      });
    });

    it('ignores formatting characters', () => {
      expect(rutCheckDigit('7.618.285')).toBe('K');
    });

    it('returns an empty string without digits', () => {
      expect(rutCheckDigit('')).toBe('');
    });
  });

  describe('rutValidate', () => {
    ['7.618.285-K', '7618285K', '7618285k', '11.111.111-1', '12345678-5', '24.965.101-k', '1-9', '007618285K']
      .forEach((rut) => {
        it(`accepts ${rut}`, () => {
          expect(rutValidate(rut)).toBe(true);
        });
      });

    ['1.111.111-1', '7.618.285-0', '12345678-K', 'K', '1', '', 'abc', '1K2-3', '1K-9', '0-0']
      .forEach((rut) => {
        it(`rejects ${JSON.stringify(rut)}`, () => {
          expect(rutValidate(rut)).toBe(false);
        });
      });

    it('rejects non string values', () => {
      expect(rutValidate(null)).toBe(false);
      expect(rutValidate(undefined)).toBe(false);
    });
  });

  describe('rutFormat', () => {
    const cases: Array<[string, string]> = [
      ['7618285K', '7.618.285-K'],
      ['111111111', '11.111.111-1'],
      ['7.618.285-k', '7.618.285-K'],
      ['19', '1-9'],
      ['1234', '123-4'],
      ['12345', '1.234-5'],
      ['1', '1'],
      ['', ''],
    ];
    cases.forEach(([input, output]) => {
      it(`${JSON.stringify(input)} → ${JSON.stringify(output)}`, () => {
        expect(rutFormat(input)).toBe(output);
      });
    });

    it('returns an empty string for non string values', () => {
      expect(rutFormat(null)).toBe('');
    });

    describe('with { dots: false }', () => {
      const dashOnly: Array<[string, string]> = [
        ['157519050', '15751905-0'],
        ['15.751.905-0', '15751905-0'],
        ['7618285k', '7618285-K'],
        ['19', '1-9'],
        ['1', '1'],
        ['', ''],
      ];
      dashOnly.forEach(([input, output]) => {
        it(`${JSON.stringify(input)} → ${JSON.stringify(output)}`, () => {
          expect(rutFormat(input, { dots: false })).toBe(output);
        });
      });

      it('keeps dots with { dots: true } or empty options', () => {
        expect(rutFormat('157519050', { dots: true })).toBe('15.751.905-0');
        expect(rutFormat('157519050', {})).toBe('15.751.905-0');
      });
    });
  });
});
