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
  title: string = 'Create a new student';
  buttonText: string = 'Create a new student';

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.createStudentFormGroup = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', Validators.required],
    });
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.title = this.id ? 'Edit a student' : this.title;
    this.buttonText = this.id ? 'Update student data' : this.title;
  }

  ngOnInit(): void {
    this.isEdit();
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
    this.studentService.createStudent(data);

    this.toastrService.success('The student was registered with success!');
    this.loading = false;
    this.router.navigate(['/list-students']);
  }

  editStudent(id: string) {
    const student: any = {
      updateDate: new Date(),
      firstName: this.createStudentFormGroup.value.firstName,
      lastName: this.createStudentFormGroup.value.lastName,
      age: this.createStudentFormGroup.value.age,
    };

    this.loading = true;

    this.studentService.updateStudent(id, student).then(() => {
      this.loading = false;
      this.toastrService.info('Student data have been modified with success');
      this.router.navigate(['/list-students']);
    });
  }

  isEdit() {
    if (this.id !== null) {
      this.loading = true;
      this.studentService.getStudent(this.id).subscribe((data) => {
        try {
          this.fillFields(data);
        } catch (error) {
          this.redirect();
        }
      });
    }
  }

  fillFields(data: any) {
    this.loading = false;
    this.createStudentFormGroup.setValue({
      firstName: data.payload.data()['firstName'],
      lastName: data.payload.data()['lastName'],
      age: data.payload.data()['age'],
    });
  }

  redirect() {
    this.toastrService.error(
      `Apparently there is no student with the ID: ${this.id} \n You will be redirected to the home page soon ...`,
      'An error has occurred...'
    );
    this.toastrService.error(
      `You will be redirected to the home page soon ...`
    );
    setTimeout(() => {
      this.router.navigate(['list-student']);
    }, 6000);
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
    this.toastrService.success(
      `${students.length} students have been registered!`
    );
  }

  readFile(event: any) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const {
          students: { student },
        } = this.convertXMLToJSON(event);
        console.log(student);

        this.createStudentByXML(student);
      } catch (error) {
        this.toastrService.error(
          'Something has missed implementing the XML file',
          'Check the XML file please'
        );
      }
    };
    reader.readAsText(file);
  }

  get formControls() {
    return this.createStudentFormGroup['controls'];
  }
}
