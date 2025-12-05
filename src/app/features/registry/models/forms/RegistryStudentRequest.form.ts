import { FormControl } from '@angular/forms';

export interface RegistryStudentForm {
  firstName: FormControl<string>;
  secondName: FormControl<string>;
  firstLastName: FormControl<string>;
  secondLastName: FormControl<string>;
  idStudent: FormControl<string>;
  grade: FormControl<string | null>;
  group: FormControl<string | null>;
  email: FormControl<string | null>;
}
