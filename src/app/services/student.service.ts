import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private firestore: AngularFirestore) {}

  addStudent(student: any): Promise<any> {
    return this.firestore.collection('students').add(student);
  }

  getStudents(): Observable<any> {
    return this.firestore
      .collection('students', (ref) => ref.orderBy('creationDate', 'asc'))
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
