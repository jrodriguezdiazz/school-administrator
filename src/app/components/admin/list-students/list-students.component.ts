import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css'],
})
export class ListStudentsComponent implements OnInit {
  students: any[] = [];
  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.studentService.getStudents().subscribe((data) => {
      this.students = [];
      data.forEach((element: any) => {
        this.students.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
    });
  }

  deleteStudent(id: string) {
    this.studentService
      .deleteStudent(id)
      .then(() => {
        this.toastr.error('Student delete with success!');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
