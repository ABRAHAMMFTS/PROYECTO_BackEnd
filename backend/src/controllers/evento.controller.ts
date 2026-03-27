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
import {Evento} from '../models';
import {EventoRepository} from '../repositories';

export class EventoController {
  constructor(
    @repository(EventoRepository)
    public eventoRepository : EventoRepository,
  ) {}

  @post('/eventos')
  @response(200, {
    description: 'Evento model instance',
    content: {'application/json': {schema: getModelSchemaRef(Evento)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {
            title: 'NewEvento',
            exclude: ['id_evento'],
          }),
        },
      },
    })
    evento: Omit<Evento, 'id_evento'>,
  ): Promise<Evento> {
    return this.eventoRepository.create(evento);
  }

  @get('/eventos/count')
  @response(200, {
    description: 'Evento model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Evento) where?: Where<Evento>,
  ): Promise<Count> {
    return this.eventoRepository.count(where);
  }

  @get('/eventos')
  @response(200, {
    description: 'Array of Evento model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Evento, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Evento) filter?: Filter<Evento>,
  ): Promise<Evento[]> {
    return this.eventoRepository.find(filter);
  }

  @patch('/eventos')
  @response(200, {
    description: 'Evento PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
    @param.where(Evento) where?: Where<Evento>,
  ): Promise<Count> {
    return this.eventoRepository.updateAll(evento, where);
  }

  @get('/eventos/{id}')
  @response(200, {
    description: 'Evento model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Evento, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Evento, {exclude: 'where'}) filter?: FilterExcludingWhere<Evento>
  ): Promise<Evento> {
    return this.eventoRepository.findById(id, filter);
  }

  @patch('/eventos/{id}')
  @response(204, {
    description: 'Evento PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Evento, {partial: true}),
        },
      },
    })
    evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.updateById(id, evento);
  }

  @put('/eventos/{id}')
  @response(204, {
    description: 'Evento PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() evento: Evento,
  ): Promise<void> {
    await this.eventoRepository.replaceById(id, evento);
  }

  @del('/eventos/{id}')
  @response(204, {
    description: 'Evento DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.eventoRepository.deleteById(id);
  }
}
