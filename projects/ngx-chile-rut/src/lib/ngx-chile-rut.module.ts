import { NgModule } from '@angular/core';
import { RutInputDirective } from './rut-input.directive';
import { RutPipe } from './rut.pipe';
import { RutValidatorDirective } from './rut-validator.directive';

/**
 * Bundles the pipe and directives for NgModule-based apps.
 * Standalone apps can import `RutPipe`, `RutInputDirective` and `RutValidatorDirective` directly.
 */
@NgModule({
  imports: [RutPipe, RutInputDirective, RutValidatorDirective],
  exports: [RutPipe, RutInputDirective, RutValidatorDirective],
})
export class NgxChileRutModule {}
