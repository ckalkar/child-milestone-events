import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Milestone } from '../../milestones/entities/milestone.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column({ name: 'original_filename', length: 255 })
  originalFilename: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_type', length: 50 })
  fileType: string; // 'image' or 'video'

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'file_size', type: 'integer', nullable: true })
  fileSize: number; // in bytes

  @Column({ type: 'integer', nullable: true })
  width: number;

  @Column({ type: 'integer', nullable: true })
  height: number;

  @Column({ type: 'integer', nullable: true })
  duration: number; // for videos (in seconds)

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ name: 'taken_date', type: 'datetime', nullable: true })
  takenDate: Date;

  @Column({ name: 'thumbnail_path', length: 500, nullable: true })
  thumbnailPath: string;

  @Column({ name: 'milestone_id', nullable: true })
  milestoneId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Milestone, (milestone) => milestone.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'milestone_id' })
  milestone: Milestone;
}

