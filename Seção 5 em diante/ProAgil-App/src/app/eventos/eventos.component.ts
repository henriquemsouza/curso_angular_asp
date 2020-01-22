import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService, defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
// import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';


defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[];
  eventos: Evento[];
  evento: Evento;
  imageLargura = 50;
  imageMargin = 2;
  mostrarImage = false;
  // modalRef: BsModalRef;
  // tslint:disable-next-line:variable-name
  _filtroLista: string;
  registerForm: FormGroup;
  modoSalvar = 'post';
  bodyDeletarEvento = '';
  titulo = 'Evento';

  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private formb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imageURL.toString();
    this.evento.imageURL = '';
    this.registerForm.patchValue(this.evento);
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  openModal(template: any) {
    this.registerForm.reset();
    template.show();
  }

  validation() {
    this.registerForm = this.formb.group({
      // tslint:disable-next-line:new-parens
      tema: ['',
        [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      // tslint:disable-next-line:new-parens
      local: ['', Validators.required],
      // tslint:disable-next-line:new-parens
      dataEvento: ['', Validators.required],
      // tslint:disable-next-line:new-parens
      qtdPessoas: ['',
        [Validators.required, Validators.max(120000)]],
      // tslint:disable-next-line:new-parens
      telefone: ['', Validators.required],
      // tslint:disable-next-line:new-parens
      email: ['',
        [Validators.required, Validators.email]],
      // tslint:disable-next-line:new-parens
      imageURL: ['', Validators.required]

    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

  uploadImage() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imageURL.split('\\', 3);
      this.evento.imageURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2]).subscribe(
        () =>{
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    } else {
      this.evento.imageURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate).subscribe(
        () =>{
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
  }

  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      console.log(this.modoSalvar);
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImage();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso');
          }, error => {
            console.log(error);
          }
        );
      } else {
        console.log('>>>>');
        this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);

        this.uploadImage();

        this.eventoService.putEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Alterado com sucesso');
          }, error => {
            console.log(error);

          }
        );
      }

    }

  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );

  }
  alternarImage() {
    this.mostrarImage = !this.mostrarImage;
  }

  getEventos() {
    this.dataAtual = new Date().getMilliseconds().toString();
    this.eventoService.getAllEvento().subscribe(
      // tslint:disable-next-line:variable-name
      (_evento: Evento[]) => {
        this.eventos = _evento;
        this.eventosFiltrados = this.eventos;
        console.log(_evento);
      }, error => {
        console.log(error);
      }
    );
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Nº: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
        this.toastr.success('Deletado com sucesso');
      }, error => {
        console.log(error);
        this.toastr.error('Erro ao tentar Deletar');
      }
    );
  }

  ngOnInit() {
    this.getEventos();
    this.validation();
  }

}
