import { DataSource } from 'typeorm';
import { Task } from './task.model';

export class Database {
  public dataSource: DataSource;
  constructor(url: string) {
    this.dataSource = new DataSource({
      type: "postgres",
      url: url,
      synchronize: true,
      logging: true,
      entities: [Task],
      subscribers: [],
      migrations: [],
    });
  }

  async initialize() {
    await this.dataSource.initialize();
    console.log('Database connected');
  }
}