import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistryStudentRequest } from '../models/request/RegistryStudentRequest';

@Injectable({ providedIn: 'root' })
export class RegistryApiService {
  private baseUrl = environment.apiUrl + '/registry';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RegistryStudentRequest[]> {
    return this.http.get<RegistryStudentRequest[]>(this.baseUrl);
  }

  getById(id: number): Observable<RegistryStudentRequest> {
    return this.http.get<RegistryStudentRequest>(`${this.baseUrl}/${id}`);
  }

  create(request: RegistryStudentRequest): Observable<RegistryStudentRequest> {
    return this.http.post<RegistryStudentRequest>(this.baseUrl, request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  update(
    id: number,
    request: RegistryStudentRequest
  ): Observable<RegistryStudentRequest> {
    return this.http.put<RegistryStudentRequest>(
      `${this.baseUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
