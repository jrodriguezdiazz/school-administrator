import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css'],
})
export class CreateStudentComponent implements OnInit {
  createStudentFormGroup: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
  ) {
    this.createStudentFormGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
      biography: [''],
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.isEdit();
  }

  addEditStudent() {
    this.submitted = true;

    if (this.createStudentFormGroup.invalid) {
      return;
    }

    if (this.id === null) {
      this.createStudent();
    } else {
      this.editStudent(this.id);
    }
  }

  createStudent() {
    const student: any = {
      creationDateNew: Date(),
      dateUpdate: new Date(),
      firstName: this.createStudentFormGroup.value.firstName,
      lastName: this.createStudentFormGroup.value.lastName,
      age: this.createStudentFormGroup.value.age,
      biography: this.createStudentFormGroup.value.biography,
    };
    this.loading = true;
    this.studentService
      .createStudent(student)
      .then(() => {
        this.toastr.success('The student was registered with success!');
        this.loading = false;
        this.router.navigate(['/list-students']);
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  editStudent(id: string) {
    const student: any = {
      updateDate: new Date(),
      firstName: this.createStudentFormGroup.value.firstName,
      lastName: this.createStudentFormGroup.value.lastName,
      age: this.createStudentFormGroup.value.age,
      biography: this.createStudentFormGroup.value.biography,
    };

    this.loading = true;

    this.studentService.updateStudent(id, student).then(() => {
      this.loading = false;
      this.toastr.info('Student data have been modified with success');
      this.router.navigate(['/list-students']);
    });
  }

  isEdit() {
    if (this.id !== null) {
      this.loading = true;
      this.studentService.getStudent(this.id).subscribe((data) => {
        this.loading = false;
        this.createStudentFormGroup.setValue({
          firstName: data.payload.data()['firstName'],
          lastName: data.payload.data()['lastName'],
          age: data.payload.data()['age'],
          biography: data.payload.data()['biography'],
        });
      });
    }
  }
}
