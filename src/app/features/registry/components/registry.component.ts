import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormErrorCodes } from 'src/app/shared/constant/FormErrorCodes';
import { FormErrorMessages } from 'src/app/shared/constant/FormErrorMessages';
import { CustomValidators } from 'src/app/shared/utils/custom-validators';
import { RegistryService } from '../services/registry.service';
import { RegistryStudentForm } from '../models/forms/RegistryStudentRequest.form';
import { RegistryApiService } from '../services/registry-api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
})
export class RegistryComponent implements OnInit {
  userBasicDataForm!: FormGroup<RegistryStudentForm>;
  userFingerprintsForm!: FormGroup;
  readonly formErrorMessage = FormErrorMessages;
  readonly formErrorCode = FormErrorCodes;

  grades = ['6', '7', '8', '9', '10', '11'];
  groups = ['1', '2', '3', '4'];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private toast: ToastService,
    private registryService: RegistryService,
    private registryApiService: RegistryApiService
  ) {}

  /**
   * Inicializa el componente.
   * Crea el formulario para registrar un usuario.
   */
  ngOnInit(): void {
    this.userBasicDataForm = this.buildBasicDataForm();
    this.userFingerprintsForm = this.buildFingerprintsForm();
  }

  private buildFingerprintsForm(): FormGroup {
    return this.fb.group({
      fingerprints: this.fb.array([this.createFingerprintGroup()]),
    });
  }

  private createFingerprintGroup(): FormGroup {
    return this.fb.group({
      captured: [false],
      data: [null],
      loading: [false],
    });
  }

  get fingerprints(): FormArray {
    return this.userFingerprintsForm.get('fingerprints') as FormArray;
  }

  addFingerprint(): void {
    if (this.fingerprints.length < 5) {
      this.fingerprints.push(this.fb.control('', Validators.required));
    }
  }

  removeFingerprint(index: number): void {
    if (this.fingerprints.length > 1) {
      this.fingerprints.removeAt(index);
    } else {
      this.fingerprints.reset();
    }
  }

  captureFingerprint(index: number): void {
    const group = this.fingerprints.at(index) as FormGroup;

    if (group.get('loading')?.value || group.get('captured')?.value) return;

    group.patchValue({ loading: true }, { emitEvent: true });

    setTimeout(() => {
      const fakeFingerprintData = `huella-${index + 1}-${Date.now()}`;
      group.patchValue({
        data: fakeFingerprintData,
        captured: true,
        loading: false,
      });
    }, 2000);
  }

  /**
   * Crea el formulario para registrar un usuario.
   * El formulario contiene los campos:
   * - firstName: primer nombre (requerido)
   * - secondName: segundo nombre (no requerido)
   * - firstLastName: primer apellido (requerido)
   * - secondLastName: segundo apellido (no requerido)
   * - idStudent: identificación del estudiante (requerido, entre 9 y 11 caracteres, solo números)
   * - grade: grado del estudiante (requerido)
   * - group: grupo del estudiante (requerido)
   */
  private buildBasicDataForm(): FormGroup<RegistryStudentForm> {
    return this.fb.nonNullable.group({
      firstName: this.createNameControl(true),
      secondName: this.createNameControl(false),
      firstLastName: this.createNameControl(true),
      secondLastName: this.createNameControl(false),
      idStudent: this.fb.nonNullable.control('', {
        validators: [
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(11),
          CustomValidators.patternValidator(
            /^[0-9]+$/,
            this.formErrorCode.NUMBERS_ONLY
          ),
        ],
      }),
      grade: this.fb.control<string | null>(null, {
        validators: [Validators.required],
      }),
      group: this.fb.control<string | null>(null, {
        validators: [Validators.required],
      }),
      email: this.fb.nonNullable.control<string | null>(null, {
        validators: [
          Validators.required,
          Validators.email,
          CustomValidators.patternValidator(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            this.formErrorCode.INVALID_EMAIL_FORMAT
          ),
          Validators.maxLength(255),
        ],
      }),
    });
  }

  /**
   * Crea un control de formulario para un nombre.
   * El nombre tiene un máximo de 20 caracteres y solo admite letras y espacios.
   * Si se pasa `isRequired` como `true`, el control también admite la validación de que el campo sea requerido.
   * @param isRequired Si el campo es requerido.
   * @returns El control de formulario.
   */
  private createNameControl(isRequired: boolean): FormControl<string> {
    const validators = [
      Validators.maxLength(100),
      CustomValidators.patternValidator(
        /^[A-Za-z ]+$/m,
        this.formErrorCode.LETTERS_ONLY
      ),
    ];
    if (isRequired) {
      validators.unshift(Validators.required);
    }
    return this.fb.nonNullable.control('', { validators });
  }

  /**
   * Crea un control de formulario para un nombre.
   * El nombre puede ser requerido o no.
   * @param isRequired Si es requerido.
   * @returns El control de formulario.
   */
  private errorMessagesMap: Record<string, (error?: any) => string> = {
    required: () => this.formErrorMessage.MANDATORY_MESSAGE,
    minlength: (err) =>
      this.formErrorMessage.MIN_LENGTH_MESSAGE(err.requiredLength),
    maxlength: (err) =>
      this.formErrorMessage.MAX_LENGTH_MESSAGE(err.requiredLength),
    numbersOnly: () => this.formErrorMessage.NUMBERS_ONLY_MESSAGE,
    lettersOnly: () => this.formErrorMessage.LETTERS_ONLY_MESSAGE,
    emailFormat: () => this.formErrorMessage.INVALID_EMAIL_FORMAT_MESSAGE,
  };

  getFieldTooltip(controlName: string): string {
    const control = this.userBasicDataForm.get(controlName);
    if (!control) return '';

    const hasRequired = control.hasValidator?.(Validators.required);

    if (control.invalid && control.touched) {
      return this.getAllErrorMessages(controlName);
    }

    if (!control.value && !hasRequired) {
      return 'Campo opcional';
    }

    if (control.value && control.valid) {
      return 'Campo correctamente diligenciado';
    }

    return 'Ingrese un valor válido';
  }

  getFieldColor(controlName: string): string {
    const control = this.userBasicDataForm.get(controlName);
    if (!control) return 'accent';

    if (control.invalid && control.touched) return 'warn';
    if (control.valid) return 'primary';
    return 'accent';
  }

  /**
   * Obtiene todos los mensajes de error para un control de formulario específico.
   * Si el control no tiene errores, devuelve una cadena vacía.
   * Los mensajes de error se obtienen utilizando un mapa de funciones de mensajes de error.
   *
   * @param controlName - El nombre del control de formulario del cual obtener los mensajes de error.
   * @returns Una cadena con los mensajes de error separados por saltos de línea,
   *          o una cadena vacía si no hay errores en el control.
   */
  getAllErrorMessages(controlName: string): string {
    const control = this.userBasicDataForm.get(controlName);

    if (!control?.errors) {
      return '';
    }

    const messages = Object.entries(control.errors)
      .map(([errorKey, errorValue]) => {
        const fn = this.errorMessagesMap[errorKey];
        return fn ? fn(errorValue) : '';
      })
      .filter((msg) => !!msg);

    return messages.join('\n');
  }

  /**
   * Envía el formulario si es válido.
   * Si el formulario es inválido, no hace nada.
   *
   * @remarks
   * Este método se llama cuando se envía el formulario.
   * Si el formulario es válido, se muestran los valores del formulario en la consola.
   * Si el formulario es inválido, se muestra un mensaje de error en la consola.
   */
  onSubmit() {
    if (this.userBasicDataForm.invalid) {
      this.userBasicDataForm.markAllAsTouched();
      this.toast.error('Por favor completa todos los campos obligatorios.');
      return;
    }

    const payload = this.userBasicDataForm.getRawValue();

    this.registryApiService.create(payload).subscribe({
      next: (response) => {
        this.toast.success('Estudiante registrado correctamente.');
        this.goBack();
      },
      error: (err) => {
        this.toast.error(
          err?.error?.message || 'No se pudo registrar el estudiante.'
        );
      },
    });
  }

  /**
   * Vuelve a la página anterior.
   */
  goBack() {
    this.location.back();
  }
}
