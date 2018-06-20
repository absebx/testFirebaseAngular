import { Component } from '@angular/core';
import { Observable, Subject, asapScheduler, pipe, of, from, interval, merge, fromEvent } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public museosDb: any;
  public eventosDb: any;
  public usersDb: any;

  public museos: Observable<any[]>;
  public eventos: Observable<any[]>;
  public users: Observable<any[]>;

  constructor(db: AngularFirestore) {
    
    this.museosDb = db.collection('/museos');
    this.eventosDb = db.collection('/eventos');
    this.usersDb = db.collection('/users');

    this.museos = this.museosDb.valueChanges();
    this.eventos = this.eventosDb.valueChanges();
    this.users = this.usersDb.valueChanges();

    console.log('imprimir');

    this.eventos.forEach(evento => {
      if (evento['name'] == 'chocolate'){
        console.log(evento);
      }
    });

    this.museos.subscribe((la)=>{
      console.log(la);
      console.log('cambiado');
    })

    // this.eventosDb.add({
    //   body: "evento por compontent",
    //   date: new Date('01/01/2018'),
    //   museo: 'bu8VFDpRpud84LTlzG5g',
    //   name: 'chocolate'
    // });

    
  }
  title = 'Crud eventos';

  eliminar(evento){
    console.log("eliminar");
    // console.log(evento);
    // console.log(this.museosDb.doc(evento));
  }
}
