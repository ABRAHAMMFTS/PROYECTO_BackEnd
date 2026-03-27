import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Publicacion, PublicacionRelations} from '../models';

export class PublicacionRepository extends DefaultCrudRepository<
  Publicacion,
  typeof Publicacion.prototype.id_publi,
  PublicacionRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Publicacion, dataSource);
  }
}
