import { Component } from '@angular/core';
import { Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { AngularFirestore,} from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Evento} from '../models/evento';
import {Museo} from '../models/museo';
import {MessageService} from 'primeng/components/common/messageservice';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public museosDb: AngularFireList<Museo>;
  public museos: any;
  public eventosDb: AngularFireList<Evento>;
  public eventos: any;
  public newEvento: Evento = new Evento();
  public fechaNuevoEvento;
  public title: string;
  public isEditing: boolean;
  public idEventEditing: string;
  public displayDialog: boolean;


  public test: Observable<any>;
  public calendar_es: any //idioma calendario

  constructor(db: AngularFirestore, dbf: AngularFireDatabase, private messageService: MessageService) {

    //datos para el calendario
    this.calendar_es = {
      //date
      closeText: "Cerrar",
      prevText: "<Ant",
      nextText: "Sig>",
      currentText: "Hoy",
      monthNames: [ "enero","febrero","marzo","abril","mayo","junio",
      "julio","agosto","septiembre","octubre","noviembre","diciembre" ],
      monthNamesShort: [ "ene","feb","mar","abr","may","jun",
      "jul","ago","sep","oct","nov","dic" ],
      dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
      dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
      dayNamesMin: [ "D","L","M","X","J","V","S" ],
      weekHeader: "Sm",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: "" ,

      //time
      timeOnlyTitle: 'Elegir una hora',
      timeText: 'Hora',
      hourText: 'Horas',
      minuteText: 'Minutos',
      secondText: 'Segundos',
      millisecText: 'Milisegundos',
      microsecText: 'Microsegundos',
      timezoneText: 'Uso horario',
      timeFormat: 'HH:mm',
      timeSuffix: '',
      amNames: ['a.m.', 'AM', 'A'],
      pmNames: ['p.m.', 'PM', 'P'],
    };

    //datos por defecto
    this.title = 'Crud Eventos';
    this.isEditing = false;
    this.displayDialog = false;

    // como buscar uno----
    this.test = dbf.object('/eventos/0').snapshotChanges().pipe(map( changes => {
      return changes.payload.val();
    }));

    this.test.subscribe(e => {
      console.log('buscado');
      console.log(e)
    });
    //------------------------
    

    // definir conexiones con firebase 
    // museos
    this.museosDb = dbf.list('museos');
    this.museosDb.snapshotChanges().pipe( map(
      changes => {
        return changes.map(m => ({key: m.payload.key, ...m.payload.val()}));
      }
    )).subscribe(museos => {
      this.museos = museos;
    });
    // eventos
    this.eventosDb = dbf.list('eventos');//.valueChanges();
    this.eventosDb.snapshotChanges().pipe( map(
      changes => {
        return changes.map(e => ({key: e.payload.key, ...e.payload.val()}));
      }
    )).subscribe( eventos => {
        this.eventos = eventos;
      }
    );
  }

  nuevoEvento(){
    console.log('nuevo');
    if(this.validarNewObject()){
      this.newEvento.date = this.newEvento.dateAux.getTime();
      this.eventosDb.push(this.newEvento);
      this.newEvento.reset();
    }
  }

  eliminarEvento(evento){
    console.log(evento.key);
    this.eventosDb.remove(evento.key);
    //si se elimina no se puede editar
    this.newEvento = new Evento();
    this.isEditing = false;
  }

  obtenerMuseo(idMuseo: string){
    let salida = "";
    if(this.museos){
      this.museos.forEach(museo => {
        if(museo.key == idMuseo){
          salida = museo.name
        }
      });
    }
    return salida;
  }

  obtenerEvento(idEvento: string){
    let salida = new Evento;
    let evtSalida: any;
    if(this.eventos){
      this.eventos.forEach(evento => {
        if(evento.key == idEvento){
          evtSalida = evento;
          evtSalida.dateAux = new Date(evento.date);
        }
      });
    }

    //se rellena para que genere una nueva instancia
    salida.name = evtSalida.name;
    salida.body = evtSalida.body;
    salida.date = evtSalida.date;
    salida.dateAux = evtSalida.dateAux;
    salida.museo = evtSalida.museo;

    if(!evtSalida){
      salida = null;
    }

    return salida;
  }

  editarEvento(idEvento: string){
    // console.log(idEvento);
    // if(this.isEditing){      
    //   this.newEvento = new Evento();
    //   this.isEditing = false;
    // }else{
    //   this.idEventEditing = idEvento;
    //   this.isEditing = true;
    //   this.newEvento = this.obtenerEvento(idEvento);
    // }

    this.idEventEditing = idEvento;
    this.isEditing = true;
    this.newEvento = this.obtenerEvento(idEvento);

  }

  cancelarEditar(){
    this.newEvento = new Evento();
    this.isEditing = false;
  }

  editarSubmit(idEvento: string){
    if(this.isEditing && this.idEventEditing && this.validarNewObject()){
      this.eventosDb.set(idEvento,this.newEvento);
      this.newEvento = new Evento();
      this.isEditing = false;
    }
  }

  validarNewObject(){
    console.log(this.newEvento);
    let salida = true;

    if(this.newEvento.name.length < 3 || this.newEvento.name == ''){
      salida = false;
    }

    if(this.newEvento.body.length < 3 || this.newEvento.body == ''){
      salida = false;
    }

    if(this.newEvento.dateAux.getTime > Date.now){
      salida = false;
    }

    if(this.newEvento.museo == -1){
      salida = false;
    }

    if(!salida){
      this.displayDialog=true;
    }

    return salida;
  }
}
