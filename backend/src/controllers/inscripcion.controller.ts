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
import {Inscripcion} from '../models';
import {InscripcionRepository} from '../repositories';

export class InscripcionController {
  constructor(
    @repository(InscripcionRepository)
    public inscripcionRepository : InscripcionRepository,
  ) {}

  @post('/inscripcions')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Inscripcion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {
            title: 'NewInscripcion',
            exclude: ['id_inscripcion'],
          }),
        },
      },
    })
    inscripcion: Omit<Inscripcion, 'id_inscripcion'>,
  ): Promise<Inscripcion> {
    return this.inscripcionRepository.create(inscripcion);
  }

  @get('/inscripcions/count')
  @response(200, {
    description: 'Inscripcion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.count(where);
  }

  @get('/inscripcions')
  @response(200, {
    description: 'Array of Inscripcion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Inscripcion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Inscripcion) filter?: Filter<Inscripcion>,
  ): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find(filter);
  }

  @patch('/inscripcions')
  @response(200, {
    description: 'Inscripcion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
    @param.where(Inscripcion) where?: Where<Inscripcion>,
  ): Promise<Count> {
    return this.inscripcionRepository.updateAll(inscripcion, where);
  }

  @get('/inscripcions/{id}')
  @response(200, {
    description: 'Inscripcion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Inscripcion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Inscripcion, {exclude: 'where'}) filter?: FilterExcludingWhere<Inscripcion>
  ): Promise<Inscripcion> {
    return this.inscripcionRepository.findById(id, filter);
  }

  @patch('/inscripcions/{id}')
  @response(204, {
    description: 'Inscripcion PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Inscripcion, {partial: true}),
        },
      },
    })
    inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.updateById(id, inscripcion);
  }

  @put('/inscripcions/{id}')
  @response(204, {
    description: 'Inscripcion PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() inscripcion: Inscripcion,
  ): Promise<void> {
    await this.inscripcionRepository.replaceById(id, inscripcion);
  }

  @del('/inscripcions/{id}')
  @response(204, {
    description: 'Inscripcion DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.inscripcionRepository.deleteById(id);
  }
}
