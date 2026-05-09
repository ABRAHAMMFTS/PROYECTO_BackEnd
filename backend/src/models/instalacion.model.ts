import {Entity, model, property, hasMany} from '@loopback/repository';
import {Deporte} from './deporte.model';
import {DeporteInstalacion} from './deporte-instalacion.model';

@model({settings: {strict: false}})
export class Instalacion extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_instalacion?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  id_zona: string;

  @hasMany(() => Deporte, {through: {model: () => DeporteInstalacion, keyFrom: 'id_instalacion', keyTo: 'id_deporte'}})
  deporte_instalacion: Deporte[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Instalacion>) {
    super(data);
  }
}

export interface InstalacionRelations {
  // describe navigational properties here
}

export type InstalacionWithRelations = Instalacion & InstalacionRelations;
