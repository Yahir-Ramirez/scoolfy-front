import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { RegistryStudentForm } from '../models/forms/RegistryStudentRequest.form';
import { RegistryStudentRequest } from '../models/request/RegistryStudentRequest';

@Injectable({
  providedIn: 'root',
})
export class RegistryService {
  private basicData = new BehaviorSubject<RegistryStudentRequest | null>(null);

  /**
   * Establece los datos básicos actuales.
   * @param data Los datos del formulario del usuario.
   */
  setBasicDataForm(data: FormGroup<RegistryStudentForm>) {
    const normalizedData: RegistryStudentRequest = this.normalizeData(data);
    this.basicData.next(normalizedData);
  }

  /**
   * Devuelve los datos básicos actuales como un observable.
   * @returns un stream observable de los datos básicos actuales.
   */
  getBasicData() {
    return this.basicData.asObservable();
  }

  /**
   * Devuelve los datos básicos actuales.
   * @returns los datos básicos actuales, o null si no hay datos.
   */
  getCurrentBasicData(): RegistryStudentRequest | null {
    return this.basicData.value;
  }

  /**
   * Limpia los datos básicos actuales.
   * Se llama a este método cuando se desea eliminar los datos básicos actuales.
   */
  clear() {
    this.basicData.next(null);
  }

  /**
   * Normaliza los datos del formulario del usuario.
   * @param data Los datos del formulario del usuario.
   * @returns Los datos del formulario del usuario normalizados.
   */
  private normalizeData(
    data: FormGroup<RegistryStudentForm>
  ): RegistryStudentRequest {
    return data.getRawValue();
  }
}
