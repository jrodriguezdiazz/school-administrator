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
      file: ['', Validators.required],
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
    this.studentService.preAddAndUpdateFile(true, '', data, this.file);

    this.toastrService.success('The student was registered with success!');
    this.loading = false;
    this.router.navigate(['/']);
  }

  editStudent(id: string) {
    const student: any = {
      updateDate: new Date(),
      firstName: this.createStudentFormGroup.value.firstName,
      lastName: this.createStudentFormGroup.value.lastName,
      age: this.createStudentFormGroup.value.age,
    };

    this.loading = true;

    this.studentService.preAddAndUpdateFile(false, id, student, this.file);

    this.loading = false;
    this.toastrService.info('Student data have been modified with success');
    this.router.navigate(['/']);
  }

  isEdit() {
    if (this.id !== null) {
      this.loading = true;
      this.studentService.getStudent(this.id).subscribe((data) => {
        try {
          this.fillFields(data);
        } catch (error) {
          // console.error(error);
          // this.redirect(
          //   `Apparently there is no student with the ID: ${this.id} \n You will be redirected to the home page soon ...`
          // );
        }
      });
    }
  }

  fillFields(data: any) {
    this.loading = false;
    this.createStudentFormGroup.patchValue({
      firstName: data.payload.data()['firstName'],
      lastName: data.payload.data()['lastName'],
      age: data.payload.data()['age'],
      // file: data.payload.data()['file'],
    });
  }

  redirect(customMessage: string) {
    this.toastrService.error(customMessage, 'An error has occurred...');
    this.toastrService.error(
      `You will be redirected to the home page soon ...`
    );
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 6000);
  }

  convertXMLToJSON(event: any) {
    const xmlData: string = (event as any).target.result;
    return JSON.parse(xml2json(xmlData, { compact: true, spaces: 4 }));
  }

  validateValuesXML(student: any) {
    const minLengthLastName = student.lastName.length > 2;
    const minLengthFirstName = student.firstName.length > 2;
    const rangeAge = student.age > 3 && student.age < 19;
    return minLengthLastName && minLengthFirstName && rangeAge;
  }
  createStudentByXML(students: any) {
    students.map((student: any) => {
      const { name, lastname, age } = student;
      const data = {
        firstName: name._text,
        lastName: lastname._text,
        age: age._text,
        file: '',
      };
      if (this.validateValuesXML(data)) {
        this.studentService
          .createStudent(data)
          .then(() => {
            this.loading = false;
            this.toastrService.success(
              `The ${data.firstName} ${data.lastName} student has been registered!`
            );
          })
          .catch((error: Error) => {
            this.loading = false;
            this.redirect(
              `An unexpected error has occurred when creating the students\n${error.name}\n${error.message}`
            );
          });
      } else {
        this.toastrService.error(
          'The name and last name must have a minimum 3 characters and age must be between 3 and 18 years old',
          `Student ${data.firstName} ${data.lastName} data does not pass with criteria`
        );
      }
    });

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 6000);
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
          students: { student: studentArray },
        } = this.convertXMLToJSON(event);

        this.createStudentByXML(studentArray);
      } catch (error) {
        this.redirect(
          'Check the XML file please\nSomething has missed implementing the XML file'
        );
      }
    };
    reader.readAsText(file);
  }

  get formControls() {
    return this.createStudentFormGroup['controls'];
  }

  handleFile(event: any) {
    this.file = event.target.files[0];
  }
}
