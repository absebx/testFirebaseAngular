export class Evento {
  key: string;
  name: string;
  museo: number;
  body: string;
  date: number; //se guarda en timestamp
  dateAux: Date; //firebase no ingresa objetos date, al mandar no se agrega a la bd

  constructor(){
    this.reset();
  }

  public reset(){
    this.name = "";
    this.museo = -1;
    this.body = "";
    let now = Date.now()
    this.dateAux = new Date(now);
  }
}