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
import {Instalacion} from '../models';
import {InstalacionRepository} from '../repositories';

export class InstalacionController {
  constructor(
    @repository(InstalacionRepository)
    public instalacionRepository : InstalacionRepository,
  ) {}

  @post('/instalacions')
  @response(200, {
    description: 'Instalacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Instalacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instalacion, {
            title: 'NewInstalacion',
            exclude: ['id_instalacion'],
          }),
        },
      },
    })
    instalacion: Omit<Instalacion, 'id_instalacion'>,
  ): Promise<Instalacion> {
    return this.instalacionRepository.create(instalacion);
  }

  @get('/instalacions/count')
  @response(200, {
    description: 'Instalacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Instalacion) where?: Where<Instalacion>,
  ): Promise<Count> {
    return this.instalacionRepository.count(where);
  }

  @get('/instalacions')
  @response(200, {
    description: 'Array of Instalacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Instalacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Instalacion) filter?: Filter<Instalacion>,
  ): Promise<Instalacion[]> {
    return this.instalacionRepository.find(filter);
  }

  @patch('/instalacions')
  @response(200, {
    description: 'Instalacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instalacion, {partial: true}),
        },
      },
    })
    instalacion: Instalacion,
    @param.where(Instalacion) where?: Where<Instalacion>,
  ): Promise<Count> {
    return this.instalacionRepository.updateAll(instalacion, where);
  }

  @get('/instalacions/{id}')
  @response(200, {
    description: 'Instalacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Instalacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Instalacion, {exclude: 'where'}) filter?: FilterExcludingWhere<Instalacion>
  ): Promise<Instalacion> {
    return this.instalacionRepository.findById(id, filter);
  }

  @patch('/instalacions/{id}')
  @response(204, {
    description: 'Instalacion PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Instalacion, {partial: true}),
        },
      },
    })
    instalacion: Instalacion,
  ): Promise<void> {
    await this.instalacionRepository.updateById(id, instalacion);
  }

  @put('/instalacions/{id}')
  @response(204, {
    description: 'Instalacion PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() instalacion: Instalacion,
  ): Promise<void> {
    await this.instalacionRepository.replaceById(id, instalacion);
  }

  @del('/instalacions/{id}')
  @response(204, {
    description: 'Instalacion DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.instalacionRepository.deleteById(id);
  }
}
