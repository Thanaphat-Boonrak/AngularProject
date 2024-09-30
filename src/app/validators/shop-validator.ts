import { FormControl, ValidationErrors } from '@angular/forms';

export class ShopValidator {
  static notonlyWhitespace(formcontrol: FormControl): ValidationErrors | null {
    if (formcontrol.value != null && formcontrol.value.trim().length === 0) {
      return { notonlyWhitespace: true };
    } else {
      return null;
    }
  }
}
