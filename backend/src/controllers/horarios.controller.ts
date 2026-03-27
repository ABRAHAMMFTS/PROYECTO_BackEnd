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
import {Horarios} from '../models';
import {HorariosRepository} from '../repositories';

export class HorariosController {
  constructor(
    @repository(HorariosRepository)
    public horariosRepository : HorariosRepository,
  ) {}

  @post('/horarios')
  @response(200, {
    description: 'Horarios model instance',
    content: {'application/json': {schema: getModelSchemaRef(Horarios)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Horarios, {
            title: 'NewHorarios',
            exclude: ['id_horario'],
          }),
        },
      },
    })
    horarios: Omit<Horarios, 'id_horario'>,
  ): Promise<Horarios> {
    return this.horariosRepository.create(horarios);
  }

  @get('/horarios/count')
  @response(200, {
    description: 'Horarios model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Horarios) where?: Where<Horarios>,
  ): Promise<Count> {
    return this.horariosRepository.count(where);
  }

  @get('/horarios')
  @response(200, {
    description: 'Array of Horarios model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Horarios, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Horarios) filter?: Filter<Horarios>,
  ): Promise<Horarios[]> {
    return this.horariosRepository.find(filter);
  }

  @patch('/horarios')
  @response(200, {
    description: 'Horarios PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Horarios, {partial: true}),
        },
      },
    })
    horarios: Horarios,
    @param.where(Horarios) where?: Where<Horarios>,
  ): Promise<Count> {
    return this.horariosRepository.updateAll(horarios, where);
  }

  @get('/horarios/{id}')
  @response(200, {
    description: 'Horarios model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Horarios, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Horarios, {exclude: 'where'}) filter?: FilterExcludingWhere<Horarios>
  ): Promise<Horarios> {
    return this.horariosRepository.findById(id, filter);
  }

  @patch('/horarios/{id}')
  @response(204, {
    description: 'Horarios PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Horarios, {partial: true}),
        },
      },
    })
    horarios: Horarios,
  ): Promise<void> {
    await this.horariosRepository.updateById(id, horarios);
  }

  @put('/horarios/{id}')
  @response(204, {
    description: 'Horarios PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() horarios: Horarios,
  ): Promise<void> {
    await this.horariosRepository.replaceById(id, horarios);
  }

  @del('/horarios/{id}')
  @response(204, {
    description: 'Horarios DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.horariosRepository.deleteById(id);
  }
}
