import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToMany ,CreateDateColumn } from 'typeorm';
import { Clinic } from 'src/clinics/clinic.entity';
import { Photo } from 'src/photos/photo.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  procedure: string; // yapılan işlem örn: botoks, dolgu

  @Column({ type: 'date', nullable: true })
  treatmentDate: string;

  @Column({ type: 'date', nullable: true })
  nextControlDate: string;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'float', default: 0 })
  paid: number;

  @Column({ type: 'float', default: 0 })
  remaining: number;

  @ManyToOne(() => Clinic, (clinic) => clinic.patients, { onDelete: 'CASCADE' })
  clinic: Clinic;

  @OneToMany(() => Photo, (photo) => photo.patient)
photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;
}
