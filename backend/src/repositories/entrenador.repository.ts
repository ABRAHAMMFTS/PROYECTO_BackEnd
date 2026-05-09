import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Entrenador, EntrenadorRelations} from '../models';

export class EntrenadorRepository extends DefaultCrudRepository<
  Entrenador,
  typeof Entrenador.prototype.id_entrenador,
  EntrenadorRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Entrenador, dataSource);
  }
}
