import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firestore as db } from 'firebase-admin';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  setDocument<T extends {}>(path: string, value: Partial<T>, merge = true) {
    return from(
      db()
        .doc(path)
        .set(value, { merge: merge }),
    );
  }

  createDocument<T extends {}>(path: string, value?: T) {
    return from(
      db()
        .collection(path)
        .doc()
        .set(value),
    );
  }

  getDocumentData<T>(path: string): Observable<T> {
    return this.getDocument<T>(path).pipe(map(snap => snap.data() as T));
  }

  getDocumentDataFromCollection<T>(path: string) {
    return this.getDocumentsFromCollection(path).pipe(
      map(docs => docs.map(doc => doc.data() as T)),
    );
  }

  getDocumentsFromCollection(path: string) {
    return from(
      db()
        .collection(path)
        .get(),
    ).pipe(map(snap => snap.docs));
  }

  getDocument<T extends {}>(path: string): Observable<db.DocumentSnapshot<T>> {
    return from(
      db()
        .doc(path)
        .get(),
    ) as Observable<db.DocumentSnapshot<T>>;
  }
}
