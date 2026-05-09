import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Publicacion extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_publi?: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  @property({
    type: 'string',
    required: true,
  })
  titulo: string;

  @property({
    type: 'string',
  })
  ruta_img: string;

  @property({
    type: 'string',
  })
  contenido?: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_publi: string;

  @property({
    type: 'string',
  })
  id_usuario?: string;

  @property({
    type: 'string',
  })
  id_equipo?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Publicacion>) {
    super(data);
  }
}

export interface PublicacionRelations {
  // describe navigational properties here
}

export type PublicacionWithRelations = Publicacion & PublicacionRelations;
