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
}
