import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateStudentComponent } from './components/admin/create-student/create-student.component';
import { ListStudentsComponent } from './components/admin/list-students/list-students.component';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  { path: '', redirectTo: 'list-students', pathMatch: 'full' },
  { path: 'list-students', component: ListStudentsComponent },
  { path: 'create-student', component: CreateStudentComponent },
  { path: 'edit-student/:id', component: CreateStudentComponent },
  { path: '**', redirectTo: 'list-students', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
