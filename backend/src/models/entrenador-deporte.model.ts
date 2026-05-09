import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class EntrenadorDeporte extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id_deporte: string;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id_entrenador: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<EntrenadorDeporte>) {
    super(data);
  }
}

export interface EntrenadorDeporteRelations {
  // describe navigational properties here
}

export type EntrenadorDeporteWithRelations = EntrenadorDeporte & EntrenadorDeporteRelations;
