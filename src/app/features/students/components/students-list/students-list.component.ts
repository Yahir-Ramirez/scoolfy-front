import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { RegistryStudentRequest } from 'src/app/features/registry/models/request/RegistryStudentRequest';
import { RegistryApiService } from 'src/app/features/registry/services/registry-api.service';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.css'],
})
export class StudentsListComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'idStudent',
    'grade',
    'group',
    'email',
  ];

  students: RegistryStudentRequest[] = [];
  filteredStudents: RegistryStudentRequest[] = [];

  search = new FormControl('');

  constructor(private registryApi: RegistryApiService) {}

  ngOnInit(): void {
    this.loadStudents();

    this.search.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
      this.applyFilter(value ?? '');
    });
  }

  loadStudents() {
    this.registryApi.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.filteredStudents = data;
      },
      error: () => {
        console.error('Error loading students');
      },
    });
  }

  applyFilter(value: string) {
    const filter = value.toLowerCase();

    this.filteredStudents = this.students.filter(
      (s) =>
        `${s.firstName} ${s.secondName} ${s.firstLastName} ${s.secondLastName}`
          .toLowerCase()
          .includes(filter) ||
        s.idStudent.toLowerCase().includes(filter) ||
        (s.email ?? '').toLowerCase().includes(filter) ||
        `${s.grade}`.includes(filter) ||
        `${s.group}`.includes(filter)
    );
  }
}
