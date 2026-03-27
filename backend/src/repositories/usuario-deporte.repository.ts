import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {UsuarioDeporte, UsuarioDeporteRelations} from '../models';

export class UsuarioDeporteRepository extends DefaultCrudRepository<
  UsuarioDeporte,
  typeof UsuarioDeporte.prototype.id_usuario,
  UsuarioDeporteRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(UsuarioDeporte, dataSource);
  }
}
