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
Deporte,
EntrenadorDeporte,
Entrenador,
} from '../models';
import {DeporteRepository} from '../repositories';

export class DeporteEntrenadorController {
  constructor(
    @repository(DeporteRepository) protected deporteRepository: DeporteRepository,
  ) { }

  @get('/deportes/{id}/entrenadors', {
    responses: {
      '200': {
        description: 'Array of Deporte has many Entrenador through EntrenadorDeporte',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Entrenador)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Entrenador>,
  ): Promise<Entrenador[]> {
    return this.deporteRepository.entrenador_deporte(id).find(filter);
  }

  @post('/deportes/{id}/entrenadors', {
    responses: {
      '200': {
        description: 'create a Entrenador model instance',
        content: {'application/json': {schema: getModelSchemaRef(Entrenador)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Deporte.prototype.id_deporte,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entrenador, {
            title: 'NewEntrenadorInDeporte',
            exclude: ['id_entrenador'],
          }),
        },
      },
    }) entrenador: Omit<Entrenador, 'id_entrenador'>,
  ): Promise<Entrenador> {
    return this.deporteRepository.entrenador_deporte(id).create(entrenador);
  }

  @patch('/deportes/{id}/entrenadors', {
    responses: {
      '200': {
        description: 'Deporte.Entrenador PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entrenador, {partial: true}),
        },
      },
    })
    entrenador: Partial<Entrenador>,
    @param.query.object('where', getWhereSchemaFor(Entrenador)) where?: Where<Entrenador>,
  ): Promise<Count> {
    return this.deporteRepository.entrenador_deporte(id).patch(entrenador, where);
  }

  @del('/deportes/{id}/entrenadors', {
    responses: {
      '200': {
        description: 'Deporte.Entrenador DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Entrenador)) where?: Where<Entrenador>,
  ): Promise<Count> {
    return this.deporteRepository.entrenador_deporte(id).delete(where);
  }
}
