import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MilestoneService } from '../../../services/milestone.service';
import { CategoryService } from '../../../services/category.service';
import { Milestone } from '../../../models/milestone.model';
import { Category } from '../../../models/category.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-milestones-list',
  templateUrl: './milestones-list.component.html',
  styleUrls: ['./milestones-list.component.scss'],
})
export class MilestonesListComponent implements OnInit {
  milestones: Milestone[] = [];
  categories: Category[] = [];
  loading = true;
  selectedCategoryId?: number;
  showMajorOnly = false;

  constructor(
    private milestoneService: MilestoneService,
    private categoryService: CategoryService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMilestones();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  loadMilestones(): void {
    this.loading = true;

    const filters: any = {};
    if (this.selectedCategoryId) {
      filters.categoryId = this.selectedCategoryId;
    }
    if (this.showMajorOnly) {
      filters.isMajor = true;
    }

    this.milestoneService.getAll(filters).subscribe({
      next: (milestones) => {
        this.milestones = milestones;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading milestones:', err);
        this.snackBar.open('Failed to load milestones', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  onFilterChange(): void {
    this.loadMilestones();
  }

  clearFilters(): void {
    this.selectedCategoryId = undefined;
    this.showMajorOnly = false;
    this.loadMilestones();
  }

  createMilestone(): void {
    this.router.navigate(['/milestones/new']);
  }

  viewMilestone(id: number): void {
    this.router.navigate(['/milestones', id]);
  }

  editMilestone(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/milestones', id, 'edit']);
  }

  deleteMilestone(milestone: Milestone, event: Event): void {
    event.stopPropagation();

    if (
      confirm(
        `Are you sure you want to delete "${milestone.title}"? This action cannot be undone.`
      )
    ) {
      this.milestoneService.delete(milestone.id).subscribe({
        next: () => {
          this.snackBar.open('Milestone deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadMilestones();
        },
        error: (err) => {
          console.error('Error deleting milestone:', err);
          this.snackBar.open('Failed to delete milestone', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
}

