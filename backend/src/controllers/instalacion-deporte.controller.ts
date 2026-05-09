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
Instalacion,
DeporteInstalacion,
Deporte,
} from '../models';
import {InstalacionRepository} from '../repositories';

export class InstalacionDeporteController {
  constructor(
    @repository(InstalacionRepository) protected instalacionRepository: InstalacionRepository,
  ) { }

  @get('/instalacions/{id}/deportes', {
    responses: {
      '200': {
        description: 'Array of Instalacion has many Deporte through DeporteInstalacion',
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
    return this.instalacionRepository.deporte_instalacion(id).find(filter);
  }

  @post('/instalacions/{id}/deportes', {
    responses: {
      '200': {
        description: 'create a Deporte model instance',
        content: {'application/json': {schema: getModelSchemaRef(Deporte)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Instalacion.prototype.id_instalacion,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deporte, {
            title: 'NewDeporteInInstalacion',
            exclude: ['id_deporte'],
          }),
        },
      },
    }) deporte: Omit<Deporte, 'id_deporte'>,
  ): Promise<Deporte> {
    return this.instalacionRepository.deporte_instalacion(id).create(deporte);
  }

  @patch('/instalacions/{id}/deportes', {
    responses: {
      '200': {
        description: 'Instalacion.Deporte PATCH success count',
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
    return this.instalacionRepository.deporte_instalacion(id).patch(deporte, where);
  }

  @del('/instalacions/{id}/deportes', {
    responses: {
      '200': {
        description: 'Instalacion.Deporte DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Deporte)) where?: Where<Deporte>,
  ): Promise<Count> {
    return this.instalacionRepository.deporte_instalacion(id).delete(where);
  }
}
