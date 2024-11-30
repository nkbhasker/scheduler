export class Scheduler {
  private frequency: number;
  private fn: () => Promise<void>;
  private interval: NodeJS.Timeout | null = null;
  constructor(frequency: number, fn: () => Promise<void>) {
    this.frequency = frequency;
    this.fn = fn;
  }

  start(): NodeJS.Timeout {
    console.log('Scheduler started with frequency ', this.frequency);
    this.interval = setInterval(this.fn, this.frequency);

    return this.interval;
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      console.log('Scheduler stopped');
    }
  }
}