import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Evento extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_evento?: string;

  @property({
    type: 'string',
    required: true,
  })
  nomEve: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_ini: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_fin: string;

  @property({
    type: 'string',
    required: true,
  })
  descripcion: string;

  @property({
    type: 'string',
    required: true,
  })
  id_deporte: string;

  @property({
    type: 'string',
    required: true,
  })
  id_instalacion: string;

  @property({
    type: 'string',
    required: true,
  })
  id_usuario: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Evento>) {
    super(data);
  }
}

export interface EventoRelations {
  // describe navigational properties here
}

export type EventoWithRelations = Evento & EventoRelations;
