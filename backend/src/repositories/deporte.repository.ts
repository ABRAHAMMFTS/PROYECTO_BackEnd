import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Deporte, DeporteRelations, Entrenador, EntrenadorDeporte} from '../models';
import {EntrenadorDeporteRepository} from './entrenador-deporte.repository';
import {EntrenadorRepository} from './entrenador.repository';

export class DeporteRepository extends DefaultCrudRepository<
  Deporte,
  typeof Deporte.prototype.id_deporte,
  DeporteRelations
> {

  public readonly entrenador_deporte: HasManyThroughRepositoryFactory<Entrenador, typeof Entrenador.prototype.id_entrenador,
          EntrenadorDeporte,
          typeof Deporte.prototype.id_deporte
        >;

  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource, @repository.getter('EntrenadorDeporteRepository') protected entrenadorDeporteRepositoryGetter: Getter<EntrenadorDeporteRepository>, @repository.getter('EntrenadorRepository') protected entrenadorRepositoryGetter: Getter<EntrenadorRepository>,
  ) {
    super(Deporte, dataSource);
    this.entrenador_deporte = this.createHasManyThroughRepositoryFactoryFor('entrenador_deporte', entrenadorRepositoryGetter, entrenadorDeporteRepositoryGetter,);
    this.registerInclusionResolver('entrenador_deporte', this.entrenador_deporte.inclusionResolver);
  }
}
