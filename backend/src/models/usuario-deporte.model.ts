import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class UsuarioDeporte extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id_usuario: string;

  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id_deporte: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UsuarioDeporte>) {
    super(data);
  }
}

export interface UsuarioDeporteRelations {
  // describe navigational properties here
}

export type UsuarioDeporteWithRelations = UsuarioDeporte & UsuarioDeporteRelations;
