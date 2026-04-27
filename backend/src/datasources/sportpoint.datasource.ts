import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Sportpoint',
  connector: 'mysql',
  url: process.env.MYSQL_URL || '',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '1807191170@ros4nne95',
  database: process.env.MYSQL_DATABASE || 'sportpoint_db',
  lazyConnect: true,
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SportpointDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Sportpoint';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Sportpoint', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
