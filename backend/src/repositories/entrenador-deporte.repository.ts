import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {EntrenadorDeporte, EntrenadorDeporteRelations} from '../models';

export class EntrenadorDeporteRepository extends DefaultCrudRepository<
  EntrenadorDeporte,
  typeof EntrenadorDeporte.prototype.id_deporte,
  EntrenadorDeporteRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(EntrenadorDeporte, dataSource);
  }
}
