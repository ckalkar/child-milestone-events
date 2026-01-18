import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Milestone } from '../milestones/entities/milestone.entity';
import { Media } from '../media/entities/media.entity';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { MediaService } from '../media/media.service';
import { MilestonesService } from '../milestones/milestones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Milestone, Media])],
  controllers: [BatchController],
  providers: [BatchService, MediaService, MilestonesService],
  exports: [BatchService],
})
export class BatchModule {}
