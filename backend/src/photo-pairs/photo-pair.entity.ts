import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';
import { Patient } from 'src/patients/patient.entity';
import { Photo } from 'src/photos/photo.entity';

@Entity('photo_pairs')
@Unique(['beforePhoto'])
@Unique(['afterPhoto'])
export class PhotoPair {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @Index()
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @OneToOne(() => Photo, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'beforePhotoId' })
  beforePhoto: Photo;

  @OneToOne(() => Photo, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'afterPhotoId' })
  afterPhoto: Photo;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;
}
