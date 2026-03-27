import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Equipo, EquipoRelations} from '../models';

export class EquipoRepository extends DefaultCrudRepository<
  Equipo,
  typeof Equipo.prototype.id_equipo,
  EquipoRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Equipo, dataSource);
  }
}
