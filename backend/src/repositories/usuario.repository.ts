import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {SportpointDataSource} from '../datasources';
import {Usuario, UsuarioRelations, Equipo, IntegranteEquipo, Deporte, UsuarioDeporte} from '../models';
import {IntegranteEquipoRepository} from './integrante-equipo.repository';
import {EquipoRepository} from './equipo.repository';
import {UsuarioDeporteRepository} from './usuario-deporte.repository';
import {DeporteRepository} from './deporte.repository';

export class UsuarioRepository extends DefaultCrudRepository<
  Usuario,
  typeof Usuario.prototype.id_usuario,
  UsuarioRelations
> {

  public readonly integrante_equipo: HasManyThroughRepositoryFactory<Equipo, typeof Equipo.prototype.id_equipo,
          IntegranteEquipo,
          typeof Usuario.prototype.id_usuario
        >;

  public readonly usuario_deporte: HasManyThroughRepositoryFactory<Deporte, typeof Deporte.prototype.id_deporte,
          UsuarioDeporte,
          typeof Usuario.prototype.id_usuario
        >;

  constructor(
    @inject('datasources.Sportpoint') dataSource: SportpointDataSource, @repository.getter('IntegranteEquipoRepository') protected integranteEquipoRepositoryGetter: Getter<IntegranteEquipoRepository>, @repository.getter('EquipoRepository') protected equipoRepositoryGetter: Getter<EquipoRepository>, @repository.getter('UsuarioDeporteRepository') protected usuarioDeporteRepositoryGetter: Getter<UsuarioDeporteRepository>, @repository.getter('DeporteRepository') protected deporteRepositoryGetter: Getter<DeporteRepository>,
  ) {
    super(Usuario, dataSource);
    this.usuario_deporte = this.createHasManyThroughRepositoryFactoryFor('usuario_deporte', deporteRepositoryGetter, usuarioDeporteRepositoryGetter,);
    this.registerInclusionResolver('usuario_deporte', this.usuario_deporte.inclusionResolver);
    this.integrante_equipo = this.createHasManyThroughRepositoryFactoryFor('integrante_equipo', equipoRepositoryGetter, integranteEquipoRepositoryGetter,);
    this.registerInclusionResolver('integrante_equipo', this.integrante_equipo.inclusionResolver);
  }
}
