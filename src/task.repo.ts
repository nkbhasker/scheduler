import { DataSource, Repository } from 'typeorm';
import { Task } from './task.model';

export class TaskRepository extends Repository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.manager);
  }

  async createTask(email: string): Promise<Task> {
    const task = new Task();
    task.email = email;
    task.createdAt = new Date();
    task.isComplete = false;

    return this.save(task);
  }

  async findIncompleteTasks(limit: number): Promise<Task[]> {
    return this.query('SELECT * FROM task WHERE is_complete = false FOR UPDATE LIMIT $1;', [limit]);
  }

  async markTasksComplete(ids: number[]): Promise<void> {
    await this.query(`UPDATE task SET is_complete = true WHERE id IN (${ids});`);
  }
}