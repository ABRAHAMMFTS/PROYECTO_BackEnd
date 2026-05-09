import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Entrenador extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_entrenador?: string;

  @property({
    type: 'number',
    default: 0,
  })
  anhos_exp?: number;

  @property({
    type: 'string',
    required: true,
  })
  id_instalacion: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Entrenador>) {
    super(data);
  }
}

export interface EntrenadorRelations {
  // describe navigational properties here
}

export type EntrenadorWithRelations = Entrenador & EntrenadorRelations;
