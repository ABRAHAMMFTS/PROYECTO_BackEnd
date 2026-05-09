import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Usuario,
IntegranteEquipo,
Equipo,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioEquipoController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/equipos', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Equipo through IntegranteEquipo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Equipo)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Equipo>,
  ): Promise<Equipo[]> {
    return this.usuarioRepository.integrante_equipo(id).find(filter);
  }

  @post('/usuarios/{id}/equipos', {
    responses: {
      '200': {
        description: 'create a Equipo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Equipo)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype.id_usuario,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {
            title: 'NewEquipoInUsuario',
            exclude: ['id_equipo'],
          }),
        },
      },
    }) equipo: Omit<Equipo, 'id_equipo'>,
  ): Promise<Equipo> {
    return this.usuarioRepository.integrante_equipo(id).create(equipo);
  }

  @patch('/usuarios/{id}/equipos', {
    responses: {
      '200': {
        description: 'Usuario.Equipo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Equipo, {partial: true}),
        },
      },
    })
    equipo: Partial<Equipo>,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.usuarioRepository.integrante_equipo(id).patch(equipo, where);
  }

  @del('/usuarios/{id}/equipos', {
    responses: {
      '200': {
        description: 'Usuario.Equipo DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Equipo)) where?: Where<Equipo>,
  ): Promise<Count> {
    return this.usuarioRepository.integrante_equipo(id).delete(where);
  }
}
