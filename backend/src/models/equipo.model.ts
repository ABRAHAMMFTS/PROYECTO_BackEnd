import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Equipo extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_equipo?: string;

  @property({
    type: 'string',
    required: true,
  })
  nomEqui: string;

  @property({
    type: 'number',
    required: true,
  })
  cant_int: number;

  @property({
    type: 'string',
    required: true,
  })
  cat_gen: string;

  @property({
    type: 'number',
    required: true,
  })
  cat_edad: number;

  @property({
    type: 'string',
    required: true,
  })
  id_deporte: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Equipo>) {
    super(data);
  }
}

export interface EquipoRelations {
  // describe navigational properties here
}

export type EquipoWithRelations = Equipo & EquipoRelations;
