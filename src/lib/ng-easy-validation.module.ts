import { NgModule } from '@angular/core';
import { NgEasyValidationDirective } from './directives/ng-easy-validation-directive';
import { NgEasyValidationService } from './services/ng-easy-validation.service';

@NgModule({
  imports: [
  ],
  declarations: [
    NgEasyValidationDirective
  ],
  providers: [
    NgEasyValidationService
  ],
  exports: [
    NgEasyValidationDirective
  ]
})
export class NgEasyValidationModule { }
