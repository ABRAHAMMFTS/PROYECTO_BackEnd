import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Horarios, HorariosRelations} from '../models';

export class HorariosRepository extends DefaultCrudRepository<
  Horarios,
  typeof Horarios.prototype.id_horario,
  HorariosRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Horarios, dataSource);
  }
}
