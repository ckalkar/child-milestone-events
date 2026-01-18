import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MilestoneService } from '../../../services/milestone.service';
import { CategoryService } from '../../../services/category.service';
import { MediaService } from '../../../services/media.service';
import { Category } from '../../../models/category.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: ['./milestone-form.component.scss'],
})
export class MilestoneFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  milestoneId?: number;
  loading = false;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private milestoneService: MilestoneService,
    private categoryService: CategoryService,
    private mediaService: MediaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      eventDate: [new Date(), Validators.required],
      categoryId: [null],
      notes: [''],
      isMajor: [false],
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.milestoneId = Number(id);
      this.loadMilestone();
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  loadMilestone(): void {
    if (!this.milestoneId) return;

    this.loading = true;
    this.milestoneService.getById(this.milestoneId).subscribe({
      next: (milestone) => {
        this.form.patchValue({
          title: milestone.title,
          description: milestone.description,
          eventDate: new Date(milestone.eventDate),
          categoryId: milestone.categoryId,
          notes: milestone.notes,
          isMajor: milestone.isMajor,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading milestone:', err);
        this.snackBar.open('Failed to load milestone', 'Close', {
          duration: 3000,
        });
        this.loading = false;
        this.router.navigate(['/milestones']);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const formValue = this.form.value;
    const milestoneData = {
      ...formValue,
      eventDate: formValue.eventDate.toISOString(),
    };

    try {
      let milestone;

      if (this.isEditMode && this.milestoneId) {
        milestone = await this.milestoneService
          .update(this.milestoneId, milestoneData)
          .toPromise();
        this.snackBar.open('Milestone updated successfully', 'Close', {
          duration: 3000,
        });
      } else {
        milestone = await this.milestoneService.create(milestoneData).toPromise();
        this.snackBar.open('Milestone created successfully', 'Close', {
          duration: 3000,
        });
      }

      // Upload media files if any
      if (this.selectedFiles.length > 0 && milestone) {
        await this.uploadMediaFiles(milestone.id);
      }

      this.router.navigate(['/milestones', milestone?.id]);
    } catch (err) {
      console.error('Error saving milestone:', err);
      this.snackBar.open('Failed to save milestone', 'Close', {
        duration: 3000,
      });
      this.loading = false;
    }
  }

  private async uploadMediaFiles(milestoneId: number): Promise<void> {
    const uploadPromises = this.selectedFiles.map((file) => {
      const metadata = {
        milestoneId,
        takenDate: this.form.value.eventDate.toISOString(),
      };
      return this.mediaService.upload(file, metadata).toPromise();
    });

    try {
      await Promise.all(uploadPromises);
      this.snackBar.open(
        `${this.selectedFiles.length} file(s) uploaded successfully`,
        'Close',
        { duration: 3000 }
      );
    } catch (err) {
      console.error('Error uploading files:', err);
      this.snackBar.open('Some files failed to upload', 'Close', {
        duration: 3000,
      });
    }
  }

  cancel(): void {
    if (this.isEditMode && this.milestoneId) {
      this.router.navigate(['/milestones', this.milestoneId]);
    } else {
      this.router.navigate(['/milestones']);
    }
  }
}

