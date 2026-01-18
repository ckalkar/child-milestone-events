import { Component, OnInit } from '@angular/core';
import { MilestoneService } from '../../services/milestone.service';
import { MediaService } from '../../services/media.service';
import { Milestone } from '../../models/milestone.model';
import { format } from 'date-fns';

interface TimelineYear {
  year: number;
  months: TimelineMonth[];
}

interface TimelineMonth {
  month: number;
  monthName: string;
  milestones: Milestone[];
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  timeline: TimelineYear[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private milestoneService: MilestoneService,
    public mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.loadTimeline();
  }

  loadTimeline(): void {
    this.loading = true;
    this.error = null;

    this.milestoneService.getAll().subscribe({
      next: (milestones) => {
        this.timeline = this.groupMilestonesByYearAndMonth(milestones);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading timeline:', err);
        this.error = 'Failed to load timeline. Please try again.';
        this.loading = false;
      },
    });
  }

  private groupMilestonesByYearAndMonth(
    milestones: Milestone[]
  ): TimelineYear[] {
    const grouped: { [year: number]: { [month: number]: Milestone[] } } = {};

    milestones.forEach((milestone) => {
      const date = new Date(milestone.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!grouped[year]) {
        grouped[year] = {};
      }
      if (!grouped[year][month]) {
        grouped[year][month] = [];
      }

      grouped[year][month].push(milestone);
    });

    const timeline: TimelineYear[] = [];

    Object.keys(grouped)
      .sort((a, b) => Number(b) - Number(a))
      .forEach((yearStr) => {
        const year = Number(yearStr);
        const months: TimelineMonth[] = [];

        Object.keys(grouped[year])
          .sort((a, b) => Number(b) - Number(a))
          .forEach((monthStr) => {
            const month = Number(monthStr);
            const monthName = format(new Date(year, month, 1), 'MMMM');

            months.push({
              month,
              monthName,
              milestones: grouped[year][month].sort(
                (a, b) =>
                  new Date(b.eventDate).getTime() -
                  new Date(a.eventDate).getTime()
              ),
            });
          });

        timeline.push({ year, months });
      });

    return timeline;
  }

  formatDate(date: Date): string {
    return format(new Date(date), 'MMM dd, yyyy');
  }

  formatTime(date: Date): string {
    return format(new Date(date), 'h:mm a');
  }

  getFirstImage(milestone: Milestone): string | null {
    if (milestone.media && milestone.media.length > 0) {
      const firstImage = milestone.media.find((m) => m.fileType === 'image');
      if (firstImage) {
        return this.mediaService.getThumbnailUrl(firstImage);
      }
    }
    return null;
  }

  getMediaCount(milestone: Milestone): number {
    return milestone.media?.length || 0;
  }
}

