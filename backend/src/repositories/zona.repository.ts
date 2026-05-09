import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Zona, ZonaRelations} from '../models';

export class ZonaRepository extends DefaultCrudRepository<
  Zona,
  typeof Zona.prototype.id_zona,
  ZonaRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Zona, dataSource);
  }
}
