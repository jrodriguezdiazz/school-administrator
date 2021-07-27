import { finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private filePath: any;
  private downloadUrl: any;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  createStudent(student: any): Promise<any> {
    const studentObj = {
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      creationDateNew: new Date(),
      dateUpdate: new Date(),
      file: student.file,
    };
    return this.firestore.collection('students').add(studentObj);
  }

  getStudents(): Observable<any> {
    return this.firestore
      .collection('students', (ref) => ref.orderBy('creationDateNew', 'asc'))
      .snapshotChanges();
  }

  deleteStudent(id: string): Promise<any> {
    return this.firestore.collection('students').doc(id).delete();
  }

  getStudent(id: string): Observable<any> {
    return this.firestore.collection('students').doc(id).snapshotChanges();
  }

  updateStudent(id: string, student: any): Promise<any> {
    const studentObj = {
      firstName: student.firstName,
      lastName: student.lastName,
      age: student.age,
      creationDateNew: new Date(),
      dateUpdate: new Date(),
      file: student.file,
    };
    return this.firestore.collection('students').doc(id).update(studentObj);
  }

  preAddAndUpdateFile(isNew: boolean, id: string, student: any, file: any) {
    return this.uploadFile(isNew, id, student, file);
  }

  uploadFile(isNew: boolean, id: string, student: any, file: any) {
    this.filePath = `files/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(this.filePath);

    const task = this.storage.upload(this.filePath, file);

    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlFile) => {
            this.downloadUrl = urlFile;
            if (isNew) {
              return this.createStudent({ ...student, file: this.downloadUrl });
            } else {
              return this.updateStudent(id, {
                ...student,
                file: this.downloadUrl,
              });
            }
          });
        })
      )
      .subscribe();
  }
}
