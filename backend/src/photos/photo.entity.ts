import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Patient } from 'src/patients/patient.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Patient, (patient) => patient.photos, { onDelete: 'CASCADE' })
  patient: Patient;

  @CreateDateColumn()
  createdAt: Date;
}
