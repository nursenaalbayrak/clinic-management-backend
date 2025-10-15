import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // örn. "A Kliniği"

  @CreateDateColumn()
  createdAt: Date;
}
