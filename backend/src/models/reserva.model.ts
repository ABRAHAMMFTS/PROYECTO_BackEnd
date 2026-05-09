import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Reserva extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_reserva?: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_resIni: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_resFin: string;

  @property({
    type: 'string',
  })
  id_usuario?: string;

  @property({
    type: 'string',
  })
  id_equipo?: string;

  @property({
    type: 'string',
    required: true,
  })
  id_instalacion: string;

  @property({
    type: 'string',
    required: true,
  })
  id_horario: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Reserva>) {
    super(data);
  }
}

export interface ReservaRelations {
  // describe navigational properties here
}

export type ReservaWithRelations = Reserva & ReservaRelations;
