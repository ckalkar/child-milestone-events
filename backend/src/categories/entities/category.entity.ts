import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Milestone } from '../../milestones/entities/milestone.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 7, nullable: true })
  color: string; // Hex color code

  @Column({ length: 50, nullable: true })
  icon: string; // Icon name/class

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Milestone, (milestone) => milestone.category)
  milestones: Milestone[];
}

