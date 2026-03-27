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
import {Deporte} from '../models';
import {DeporteRepository} from '../repositories';

export class DeporteController {
  constructor(
    @repository(DeporteRepository)
    public deporteRepository : DeporteRepository,
  ) {}

  @post('/deportes')
  @response(200, {
    description: 'Deporte model instance',
    content: {'application/json': {schema: getModelSchemaRef(Deporte)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {
            title: 'NewDeporte',
            exclude: ['id_deporte'],
          }),
        },
      },
    })
    deporte: Omit<Deporte, 'id_deporte'>,
  ): Promise<Deporte> {
    return this.deporteRepository.create(deporte);
  }

  @get('/deportes/count')
  @response(200, {
    description: 'Deporte model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Deporte) where?: Where<Deporte>,
  ): Promise<Count> {
    return this.deporteRepository.count(where);
  }

  @get('/deportes')
  @response(200, {
    description: 'Array of Deporte model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Deporte, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Deporte) filter?: Filter<Deporte>,
  ): Promise<Deporte[]> {
    return this.deporteRepository.find(filter);
  }

  @patch('/deportes')
  @response(200, {
    description: 'Deporte PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {partial: true}),
        },
      },
    })
    deporte: Deporte,
    @param.where(Deporte) where?: Where<Deporte>,
  ): Promise<Count> {
    return this.deporteRepository.updateAll(deporte, where);
  }

  @get('/deportes/{id}')
  @response(200, {
    description: 'Deporte model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Deporte, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Deporte, {exclude: 'where'}) filter?: FilterExcludingWhere<Deporte>
  ): Promise<Deporte> {
    return this.deporteRepository.findById(id, filter);
  }

  @patch('/deportes/{id}')
  @response(204, {
    description: 'Deporte PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {partial: true}),
        },
      },
    })
    deporte: Deporte,
  ): Promise<void> {
    await this.deporteRepository.updateById(id, deporte);
  }

  @put('/deportes/{id}')
  @response(204, {
    description: 'Deporte PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() deporte: Deporte,
  ): Promise<void> {
    await this.deporteRepository.replaceById(id, deporte);
  }

  @del('/deportes/{id}')
  @response(204, {
    description: 'Deporte DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.deporteRepository.deleteById(id);
  }
}
