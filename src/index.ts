import "reflect-metadata"
import express from 'express';
import { Scheduler } from './scheduler';
import { Database } from './db';
import { TaskRepository } from './task.repo';
import { TaskService } from './task.service';

const FREQUENCY = process.env.FREQUENCY ? parseInt(process.env.FREQUENCY) : 1000;
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT) : 10;
const PORT = process.env.PORT || 3000;
const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error('POSTGRES_URL is required');
  process.exit(1);
}

const app = express();
app.use(express.json());

const db = new Database(POSTGRES_URL);
const taskRepo = new TaskRepository(db.dataSource);
const taskService = new TaskService(taskRepo, LIMIT);
const scheduler = new Scheduler(FREQUENCY, taskService.runTasks.bind(taskService));

app.post('/task', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Email is required');
  }
  try {
    await taskService.createTask(email);
    return res.json({ message: 'Task created' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const shutdown = async () => {
  console.log('Shutting down');
  scheduler.stop();
  server.close(() => console.log('Server closed'));
}

const server = app.listen(PORT, () => {
  db.initialize().catch(() => process.exit(1));
  scheduler.start();
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);