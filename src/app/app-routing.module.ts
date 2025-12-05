import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () =>
      import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'access',
    loadChildren: () =>
      import('./features/access/access.module').then((m) => m.AccessModule),
  },
  {
    path: 'registry',
    loadChildren: () =>
      import('./features/registry/registry.module').then(
        (m) => m.RegistryModule
      ),
  },
  {
    path: 'students',
    loadChildren: () =>
      import('./features/students/students.module').then(
        (m) => m.StudentsModule
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
