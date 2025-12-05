export interface RegistryStudentRequest {
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  idStudent: string;
  grade?: string | null;
  group?: string | null;
  email?: string | null;
}
