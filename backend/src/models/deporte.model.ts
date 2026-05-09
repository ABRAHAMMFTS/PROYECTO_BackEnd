import {Entity, model, property, hasMany} from '@loopback/repository';
import {Entrenador} from './entrenador.model';
import {EntrenadorDeporte} from './entrenador-deporte.model';

@model({settings: {strict: false}})
export class Deporte extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_deporte?: string;

  @property({
    type: 'string',
    required: true,
  })
  nomDepo: string;

  @hasMany(() => Entrenador, {through: {model: () => EntrenadorDeporte, keyFrom: 'id_deporte', keyTo: 'id_entrenador'}})
  entrenador_deporte: Entrenador[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Deporte>) {
    super(data);
  }
}

export interface DeporteRelations {
  // describe navigational properties here
}

export type DeporteWithRelations = Deporte & DeporteRelations;
