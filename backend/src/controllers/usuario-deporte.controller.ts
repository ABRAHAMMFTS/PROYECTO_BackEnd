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
UsuarioDeporte,
Deporte,
} from '../models';
import {UsuarioRepository} from '../repositories';

export class UsuarioDeporteController {
  constructor(
    @repository(UsuarioRepository) protected usuarioRepository: UsuarioRepository,
  ) { }

  @get('/usuarios/{id}/deportes', {
    responses: {
      '200': {
        description: 'Array of Usuario has many Deporte through UsuarioDeporte',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Deporte)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Deporte>,
  ): Promise<Deporte[]> {
    return this.usuarioRepository.usuario_deporte(id).find(filter);
  }

  @post('/usuarios/{id}/deportes', {
    responses: {
      '200': {
        description: 'create a Deporte model instance',
        content: {'application/json': {schema: getModelSchemaRef(Deporte)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Usuario.prototype.id_usuario,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {
            title: 'NewDeporteInUsuario',
            exclude: ['id_deporte'],
          }),
        },
      },
    }) deporte: Omit<Deporte, 'id_deporte'>,
  ): Promise<Deporte> {
    return this.usuarioRepository.usuario_deporte(id).create(deporte);
  }

  @patch('/usuarios/{id}/deportes', {
    responses: {
      '200': {
        description: 'Usuario.Deporte PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {partial: true}),
        },
      },
    })
    deporte: Partial<Deporte>,
    @param.query.object('where', getWhereSchemaFor(Deporte)) where?: Where<Deporte>,
  ): Promise<Count> {
    return this.usuarioRepository.usuario_deporte(id).patch(deporte, where);
  }

  @del('/usuarios/{id}/deportes', {
    responses: {
      '200': {
        description: 'Usuario.Deporte DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Deporte)) where?: Where<Deporte>,
  ): Promise<Count> {
    return this.usuarioRepository.usuario_deporte(id).delete(where);
  }
}
