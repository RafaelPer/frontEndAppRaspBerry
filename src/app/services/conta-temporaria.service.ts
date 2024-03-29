import { Usuarios } from './../shared/usuarios.class';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




@Injectable({
  providedIn: 'root'
})
export class ContaTemporariaService {

  private usuariosCollection: AngularFirestoreCollection<Usuarios>;
  
  private usuarios: Observable<Usuarios[]>;

  constructor(private db: AngularFirestore) { 
    this.usuariosCollection = this.db.collection<Usuarios>('usuarios');
    
    this.usuarios = this.usuariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUsuarios() {
    return this.usuarios;
  }
 
  getUsuariosId(id) {
    return this.usuariosCollection.doc<Usuarios>(id).valueChanges();
  }

  getUsuariosEmail(email) {
    this.usuariosCollection = this.db.collection<Usuarios>("usuarios", ref => ref.where('email', '==', email).where('isActivate', '==', 'true'));
    this.usuarios = this.usuariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    return this.usuarios;
  }
 
  updateUsuarios(usuarios: Usuarios, id: string) {
    return this.usuariosCollection.doc(id).update(usuarios);
  }
 
  addUsuarios(usuarios: Usuarios) {
    return this.usuariosCollection.add(usuarios);
  }
 
  removeUsuarios(id) {
    return this.usuariosCollection.doc(id).delete();
  }
}
