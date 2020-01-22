import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: any = [];
  eventos: any;
  imageLargura = 50;
  imageMargin = 2;
  mostrarImage = false;

  // tslint:disable-next-line:variable-name
  _filtroLista: string;
  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  constructor(private http: HttpClient) { }

  filtrarEventos(filtrarPor: string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );

  }
  alternarImage() {
    this.mostrarImage = !this.mostrarImage;
  }

  getEventos() {
    this.http.get('http://localhost:5000/Api/WeatherForecast').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }


  ngOnInit() {
    this.getEventos();
  }

}
