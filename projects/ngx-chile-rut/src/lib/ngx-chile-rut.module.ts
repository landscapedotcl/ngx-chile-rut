import { NgModule } from '@angular/core';
import { RutInputDirective } from './rut-input.directive';
import { RutPipe } from './rut.pipe';
import { RutValidatorDirective } from './rut-validator.directive';

/**
 * Bundles the pipe and directives. Import it in the NgModule that uses them.
 */
@NgModule({
  declarations: [RutPipe, RutInputDirective, RutValidatorDirective],
  exports: [RutPipe, RutInputDirective, RutValidatorDirective],
})
export class NgxChileRutModule {}
