import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Reserva, ReservaRelations} from '../models';

export class ReservaRepository extends DefaultCrudRepository<
  Reserva,
  typeof Reserva.prototype.id_reserva,
  ReservaRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Reserva, dataSource);
  }
}
