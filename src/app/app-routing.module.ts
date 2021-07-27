import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateStudentComponent } from './components/create-student/create-student.component';
import { ListStudentsComponent } from './components/list-students/list-students.component';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListStudentsComponent },
  { path: 'list-students', component: ListStudentsComponent },
  { path: 'create-student', component: CreateStudentComponent },
  { path: 'edit-student/:id', component: CreateStudentComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
