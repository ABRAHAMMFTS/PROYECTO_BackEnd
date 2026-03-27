import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {IntegranteEquipo, IntegranteEquipoRelations} from '../models';

export class IntegranteEquipoRepository extends DefaultCrudRepository<
  IntegranteEquipo,
  typeof IntegranteEquipo.prototype.id_usuario,
  IntegranteEquipoRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(IntegranteEquipo, dataSource);
  }
}
