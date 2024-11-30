import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: 'text', name: 'email' })
  email: string | undefined;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date | undefined;

  @Column({ type: 'bool', name: 'is_complete' })
  isComplete: boolean | undefined;
}