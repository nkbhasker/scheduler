import { Task } from './task.model';
import { TaskRepository } from './task.repo';

export class TaskService {
  private taskRepo: TaskRepository;
  private limit: number;
  constructor(taskRepo: TaskRepository, limit: number) {
    this.taskRepo = taskRepo;
    this.limit = limit;
  }

  async createTask(email: string): Promise<Task> {
    return this.taskRepo.createTask(email);
  }

  async runTasks(): Promise<void> {
    const tasks = await this.taskRepo.findIncompleteTasks(this.limit);
    const ids = tasks.map((task) => task.id!);
    if (!!ids.length) {
      await this.taskRepo.markTasksComplete(ids);
    }
  }
}