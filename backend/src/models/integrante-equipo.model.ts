import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    mysql: {table: 'integrante_equipo'}
  }
})
export class IntegranteEquipo extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  rol_equipo: string;

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
  id_equipo: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<IntegranteEquipo>) {
    super(data);
  }
}

export interface IntegranteEquipoRelations {
  // describe navigational properties here
}

export type IntegranteEquipoWithRelations = IntegranteEquipo & IntegranteEquipoRelations;
