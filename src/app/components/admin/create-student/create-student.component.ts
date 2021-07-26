import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/services/student.service';
import { xml2json } from 'xml-js';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css'],
})
export class CreateStudentComponent implements OnInit {
  private file: any;
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

  handleImage($event: any) {
    this.file = $event.target.files[0];
    console.log(this.file);
  }

  addEditStudent(data: any) {
    this.submitted = true;

    if (this.createStudentFormGroup.invalid) {
      return;
    }

    if (this.id === null) {
      this.createStudent(data);
    } else {
      this.editStudent(this.id);
    }
  }

  createStudent(data: any) {
    this.loading = true;
    this.studentService.preAddAndUpdateStudent(data, this.file);

    this.toastr.success('The student was registered with success!');
    this.loading = false;
    this.router.navigate(['/list-students']);
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

  convertXMLToJSON(event: any) {
    const xmlData: string = (event as any).target.result;
    return JSON.parse(xml2json(xmlData, { compact: true, spaces: 4 }));
  }

  createStudentByXML(students: any) {
    students.map((student: any) => {
      const { name, lastname, age } = student;
      const data = {
        creationDateNew: Date(),
        dateUpdate: new Date(),
        firstName: name._text,
        lastName: lastname._text,
        age: age._text,
        biography: '',
      };

      this.studentService
        .createStudent(data)
        .then(() => {
          this.loading = false;
          this.router.navigate(['/list-students']);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    });
    this.toastr.success(`${students.length} students have been registered!`);
  }

  readFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const {
        students: { student },
      } = this.convertXMLToJSON(event);
      console.log(student);

      this.createStudentByXML(student);
    };
    reader.readAsText(file);
  }

  get formControls() {
    return this.createStudentFormGroup['controls'];
  }
}
