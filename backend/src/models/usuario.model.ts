import {Entity, model, property, hasMany} from '@loopback/repository';
import {Equipo} from './equipo.model';
import {IntegranteEquipo} from './integrante-equipo.model';
import {Deporte} from './deporte.model';
import {UsuarioDeporte} from './usuario-deporte.model';

@model({settings: {strict: false}})
export class Usuario extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id_usuario?: string;

  @property({
    type: 'string',
    required: true,
  })
  correo: string;

  @property({
    type: 'number',
    required: true,
  })
  edad: number;

  @property({
    type: 'string',
    required: true,
  })
  sexo: string;

  @property({
    type: 'string',
    required: true,
  })
  municipio: string;

  @property({
    type: 'string',
    required: true,
  })
  contrasenha: string;

  @property({
    type: 'string',
    required: true,
  })
  nomUsu: string;

  @property({
    type: 'string',
  })
  telefono?: string;

  @property({
    type: 'date',
    required: true,
  })
  fecha_creacion: string;

  @hasMany(() => Equipo, {through: {model: () => IntegranteEquipo, keyFrom: 'id_usuario', keyTo: 'id_equipo'}})
  integrante_equipo: Equipo[];

  @hasMany(() => Deporte, {through: {model: () => UsuarioDeporte, keyFrom: 'id_usuario', keyTo: 'id_deporte'}})
  usuario_deporte: Deporte[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
