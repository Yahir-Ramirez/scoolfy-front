import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Valida que el valor del control cumpla con el patrón dado.
   * Si el valor es nulo o vacío, se considera válido.
   * @param regex Expresión regular que debe cumplir el valor del control.
   * @param errorKey Clave del objeto que se devuelve como error si el valor no cumple con el patrón.
   * La clave se utiliza para acceder a la propiedad del objeto de errores que contiene el valor del control.
   * @returns Función de validación que se puede pasar como parámetro de Validators.
   */
  static patternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valid = !control.value || regex.test(control.value);
      return valid ? null : { [errorKey]: { value: control.value } };
    };
  }
}
