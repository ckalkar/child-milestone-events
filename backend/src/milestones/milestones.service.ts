import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Milestone } from './entities/milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
  ) {}

  async create(createMilestoneDto: CreateMilestoneDto): Promise<Milestone> {
    const milestone = this.milestoneRepository.create({
      ...createMilestoneDto,
      eventDate: new Date(createMilestoneDto.eventDate),
    });
    return await this.milestoneRepository.save(milestone);
  }

  async findAll(params?: {
    categoryId?: number;
    isMajor?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<Milestone[]> {
    const query = this.milestoneRepository.createQueryBuilder('milestone')
      .leftJoinAndSelect('milestone.category', 'category')
      .leftJoinAndSelect('milestone.media', 'media')
      .orderBy('milestone.eventDate', 'DESC');

    if (params?.categoryId) {
      query.andWhere('milestone.categoryId = :categoryId', {
        categoryId: params.categoryId,
      });
    }

    if (params?.isMajor !== undefined) {
      query.andWhere('milestone.isMajor = :isMajor', {
        isMajor: params.isMajor,
      });
    }

    if (params?.startDate && params?.endDate) {
      query.andWhere('milestone.eventDate BETWEEN :startDate AND :endDate', {
        startDate: params.startDate,
        endDate: params.endDate,
      });
    } else if (params?.startDate) {
      query.andWhere('milestone.eventDate >= :startDate', {
        startDate: params.startDate,
      });
    } else if (params?.endDate) {
      query.andWhere('milestone.eventDate <= :endDate', {
        endDate: params.endDate,
      });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<Milestone> {
    const milestone = await this.milestoneRepository.findOne({
      where: { id },
      relations: ['category', 'media'],
    });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return milestone;
  }

  async update(
    id: number,
    updateMilestoneDto: UpdateMilestoneDto,
  ): Promise<Milestone> {
    const milestone = await this.findOne(id);
    
    Object.assign(milestone, {
      ...updateMilestoneDto,
      eventDate: updateMilestoneDto.eventDate
        ? new Date(updateMilestoneDto.eventDate)
        : milestone.eventDate,
    });

    return await this.milestoneRepository.save(milestone);
  }

  async remove(id: number): Promise<void> {
    const milestone = await this.findOne(id);
    await this.milestoneRepository.remove(milestone);
  }

  async getTimeline(): Promise<any> {
    const milestones = await this.findAll();
    
    // Group by year and month
    const timeline = milestones.reduce((acc, milestone) => {
      const date = new Date(milestone.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      if (!acc[year]) {
        acc[year] = {};
      }
      
      if (!acc[year][month]) {
        acc[year][month] = [];
      }
      
      acc[year][month].push(milestone);
      
      return acc;
    }, {});

    return timeline;
  }

  async getStats(): Promise<any> {
    const total = await this.milestoneRepository.count();
    const major = await this.milestoneRepository.count({
      where: { isMajor: true },
    });

    const byCategory = await this.milestoneRepository
      .createQueryBuilder('milestone')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(milestone.id)', 'count')
      .leftJoin('milestone.category', 'category')
      .groupBy('category.id')
      .getRawMany();

    return {
      total,
      major,
      byCategory,
    };
  }
}

