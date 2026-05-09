import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Entrenador} from '../models';
import {EntrenadorRepository} from '../repositories';

export class EntrenadorController {
  constructor(
    @repository(EntrenadorRepository)
    public entrenadorRepository : EntrenadorRepository,
  ) {}

  @post('/entrenadors')
  @response(200, {
    description: 'Entrenador model instance',
    content: {'application/json': {schema: getModelSchemaRef(Entrenador)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entrenador, {
            title: 'NewEntrenador',
            exclude: ['id_entrenador'],
          }),
        },
      },
    })
    entrenador: Omit<Entrenador, 'id_entrenador'>,
  ): Promise<Entrenador> {
    return this.entrenadorRepository.create(entrenador);
  }

  @get('/entrenadors/count')
  @response(200, {
    description: 'Entrenador model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Entrenador) where?: Where<Entrenador>,
  ): Promise<Count> {
    return this.entrenadorRepository.count(where);
  }

  @get('/entrenadors')
  @response(200, {
    description: 'Array of Entrenador model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Entrenador, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Entrenador) filter?: Filter<Entrenador>,
  ): Promise<Entrenador[]> {
    return this.entrenadorRepository.find(filter);
  }

  @patch('/entrenadors')
  @response(200, {
    description: 'Entrenador PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entrenador, {partial: true}),
        },
      },
    })
    entrenador: Entrenador,
    @param.where(Entrenador) where?: Where<Entrenador>,
  ): Promise<Count> {
    return this.entrenadorRepository.updateAll(entrenador, where);
  }

  @get('/entrenadors/{id}')
  @response(200, {
    description: 'Entrenador model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Entrenador, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Entrenador, {exclude: 'where'}) filter?: FilterExcludingWhere<Entrenador>
  ): Promise<Entrenador> {
    return this.entrenadorRepository.findById(id, filter);
  }

  @patch('/entrenadors/{id}')
  @response(204, {
    description: 'Entrenador PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Entrenador, {partial: true}),
        },
      },
    })
    entrenador: Entrenador,
  ): Promise<void> {
    await this.entrenadorRepository.updateById(id, entrenador);
  }

  @put('/entrenadors/{id}')
  @response(204, {
    description: 'Entrenador PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() entrenador: Entrenador,
  ): Promise<void> {
    await this.entrenadorRepository.replaceById(id, entrenador);
  }

  @del('/entrenadors/{id}')
  @response(204, {
    description: 'Entrenador DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.entrenadorRepository.deleteById(id);
  }
}
