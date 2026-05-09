import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Instalacion, InstalacionRelations, Deporte, DeporteInstalacion} from '../models';
import {DeporteInstalacionRepository} from './deporte-instalacion.repository';
import {DeporteRepository} from './deporte.repository';

export class InstalacionRepository extends DefaultCrudRepository<
  Instalacion,
  typeof Instalacion.prototype.id_instalacion,
  InstalacionRelations
> {

  public readonly deporte_instalacion: HasManyThroughRepositoryFactory<Deporte, typeof Deporte.prototype.id_deporte,
          DeporteInstalacion,
          typeof Instalacion.prototype.id_instalacion
        >;

  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource, @repository.getter('DeporteInstalacionRepository') protected deporteInstalacionRepositoryGetter: Getter<DeporteInstalacionRepository>, @repository.getter('DeporteRepository') protected deporteRepositoryGetter: Getter<DeporteRepository>,
  ) {
    super(Instalacion, dataSource);
    this.deporte_instalacion = this.createHasManyThroughRepositoryFactoryFor('deporte_instalacion', deporteRepositoryGetter, deporteInstalacionRepositoryGetter,);
    this.registerInclusionResolver('deporte_instalacion', this.deporte_instalacion.inclusionResolver);
  }
}
