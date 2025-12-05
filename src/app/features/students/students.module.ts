import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './components/students.component';
import { StudentsRoutingModule } from './student-routing.module';
import { StudentsListComponent } from './components/students-list/students-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StudentsComponent, StudentsListComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    StudentsRoutingModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
  ],
  providers: [],
})
export class StudentsModule {}
