/**
 * Removes every character that is not a digit or a check digit `K`,
 * strips leading zeros and upper-cases the result.
 *
 * rutClean('7.618.285-k') === '7618285K'
 */
export function rutClean(value: unknown): string {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return '';
  }
  return String(value)
    .replace(/[^0-9kK]+/g, '')
    .replace(/^0+/, '')
    .toUpperCase();
}

/**
 * Computes the check digit (`0`-`9` or `K`) for a RUT body (without check digit).
 * Returns an empty string when the body has no digits.
 *
 * rutCheckDigit('7618285') === 'K'
 */
export function rutCheckDigit(body: string | number): string {
  const digits = String(body).replace(/\D+/g, '');
  if (!digits) {
    return '';
  }
  let sum = 0;
  let factor = 2;
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += Number(digits.charAt(i)) * factor;
    factor = factor === 7 ? 2 : factor + 1;
  }
  const dv = 11 - (sum % 11);
  if (dv === 11) {
    return '0';
  }
  if (dv === 10) {
    return 'K';
  }
  return String(dv);
}

/**
 * Validates a RUT, formatted or not.
 *
 * rutValidate('7.618.285-K') === true
 * rutValidate('7618285K') === true
 * rutValidate('1.111.111-1') === false
 */
export function rutValidate(value: unknown): boolean {
  const rut = rutClean(value);
  if (rut.length < 2) {
    return false;
  }
  const body = rut.slice(0, -1);
  if (!/^\d+$/.test(body)) {
    return false;
  }
  return rutCheckDigit(body) === rut.slice(-1);
}

export interface RutFormatOptions {
  /** Thousands separators in the body. `false` gives `15751905-0`. Defaults to `true`. */
  dots?: boolean;
}

/**
 * Formats a RUT as `XX.XXX.XXX-X`, or `XXXXXXXX-X` with `{ dots: false }`.
 * Works on partial input too.
 *
 * rutFormat('7618285K') === '7.618.285-K'
 * rutFormat('157519050', { dots: false }) === '15751905-0'
 */
export function rutFormat(value: unknown, options?: RutFormatOptions): string {
  const rut = rutClean(value);
  if (rut.length <= 1) {
    return rut;
  }
  const body = rut.slice(0, -1);
  const dv = rut.slice(-1);
  const dots = !options || options.dots !== false;
  return `${dots ? body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : body}-${dv}`;
}
