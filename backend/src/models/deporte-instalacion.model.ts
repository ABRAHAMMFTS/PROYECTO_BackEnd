import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class DeporteInstalacion extends Entity {
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
  id_instalacion: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DeporteInstalacion>) {
    super(data);
  }
}

export interface DeporteInstalacionRelations {
  // describe navigational properties here
}

export type DeporteInstalacionWithRelations = DeporteInstalacion & DeporteInstalacionRelations;
