import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Inscripcion, InscripcionRelations} from '../models';

export class InscripcionRepository extends DefaultCrudRepository<
  Inscripcion,
  typeof Inscripcion.prototype.id_inscripcion,
  InscripcionRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Inscripcion, dataSource);
  }
}
