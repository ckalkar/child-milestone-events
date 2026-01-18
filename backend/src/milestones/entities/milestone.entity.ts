import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('milestones')
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'event_date', type: 'datetime' })
  eventDate: Date;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_major', type: 'boolean', default: false })
  isMajor: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.milestones, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Media, (media) => media.milestone, {
    cascade: true,
  })
  media: Media[];
}

