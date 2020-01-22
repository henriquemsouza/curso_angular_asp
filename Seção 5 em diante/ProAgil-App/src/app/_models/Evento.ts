import { Lote } from './Lote';
import { Palestrante } from './Palestrante';
import { RedeSocial } from './RedeSocial';

export class Evento {


  constructor() {

  }

  id: number;
  local: string;
  dataEvento: Date;
  tema: string;
  qtdPessoas: number;
  imageURL: string;
  telefone: string;
  email: string;
  lotes: Lote[];
  redesSociais: RedeSocial[];
  palestranteEventos: Palestrante[];
}
