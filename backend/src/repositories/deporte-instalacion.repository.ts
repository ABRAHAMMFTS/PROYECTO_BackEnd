import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {DeporteInstalacion, DeporteInstalacionRelations} from '../models';

export class DeporteInstalacionRepository extends DefaultCrudRepository<
  DeporteInstalacion,
  typeof DeporteInstalacion.prototype.id_deporte,
  DeporteInstalacionRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(DeporteInstalacion, dataSource);
  }
}
