import { Pipe, PipeTransform } from '@angular/core';
import { RutFormatOptions, rutFormat } from './rut-helpers';

/**
 * Formats a RUT in templates:
 * `{{ '7618285K' | rut }}` → `7.618.285-K`
 * `{{ '157519050' | rut:{ dots: false } }}` → `15751905-0`
 */
@Pipe({
  name: 'rut',
  standalone: true,
})
export class RutPipe implements PipeTransform {
  transform(value: unknown, options?: RutFormatOptions): string {
    return rutFormat(value, options);
  }
}
