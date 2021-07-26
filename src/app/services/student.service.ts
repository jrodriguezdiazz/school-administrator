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
      biography: this.downloadUrl || '',
      fileRef: this.filePath || '',
      creationDateNew: new Date(),
      dateUpdate: new Date(),
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

  updateStudent(id: string, data: any): Promise<any> {
    return this.firestore.collection('students').doc(id).update(data);
  }

  preAddAndUpdateStudent(student: any, file: any) {
    this.uploadDocument(student, file);
  }

  private uploadDocument(student: any, file: any) {
    if (!file) {
      this.createStudent(student);
    } else {
      this.filePath = `documents/${file.name}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(this.filePath);
      const task = this.storage.upload(this.filePath, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((urlFile) => {
              this.downloadUrl = urlFile;
              this.createStudent(student);
            });
          })
        )
        .subscribe();
    }
  }
}
