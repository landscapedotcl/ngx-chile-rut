import { Pipe, PipeTransform } from '@angular/core';
import { rutFormat } from './rut-helpers';

/**
 * Formats a RUT in templates: `{{ '7618285K' | rut }}` → `7.618.285-K`.
 */
@Pipe({
  name: 'rut',
})
export class RutPipe implements PipeTransform {
  transform(value: unknown): string {
    return rutFormat(value);
  }
}
