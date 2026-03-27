import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Evento, EventoRelations} from '../models';

export class EventoRepository extends DefaultCrudRepository<
  Evento,
  typeof Evento.prototype.id_evento,
  EventoRelations
> {
  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource,
  ) {
    super(Evento, dataSource);
  }
}
