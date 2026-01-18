import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MilestoneService } from '../../../services/milestone.service';
import { MediaService } from '../../../services/media.service';
import { Milestone } from '../../../models/milestone.model';
import { Media } from '../../../models/media.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-milestone-detail',
  templateUrl: './milestone-detail.component.html',
  styleUrls: ['./milestone-detail.component.scss'],
})
export class MilestoneDetailComponent implements OnInit {
  milestone?: Milestone;
  loading = true;
  uploadingMedia = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private milestoneService: MilestoneService,
    public mediaService: MediaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMilestone(Number(id));
    }
  }

  loadMilestone(id: number): void {
    this.loading = true;
    this.milestoneService.getById(id).subscribe({
      next: (milestone) => {
        this.milestone = milestone;
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

  editMilestone(): void {
    if (this.milestone) {
      this.router.navigate(['/milestones', this.milestone.id, 'edit']);
    }
  }

  deleteMilestone(): void {
    if (!this.milestone) return;

    if (
      confirm(
        `Are you sure you want to delete "${this.milestone.title}"? This action cannot be undone.`
      )
    ) {
      this.milestoneService.delete(this.milestone.id).subscribe({
        next: () => {
          this.snackBar.open('Milestone deleted successfully', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/milestones']);
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !this.milestone) return;

    this.uploadingMedia = true;
    const files = Array.from(input.files);

    const uploadPromises = files.map((file) => {
      const metadata = {
        milestoneId: this.milestone!.id,
        takenDate: this.milestone!.eventDate.toString(),
      };
      return this.mediaService.upload(file, metadata).toPromise();
    });

    Promise.all(uploadPromises)
      .then(() => {
        this.snackBar.open(
          `${files.length} file(s) uploaded successfully`,
          'Close',
          { duration: 3000 }
        );
        this.loadMilestone(this.milestone!.id);
        this.uploadingMedia = false;
      })
      .catch((err) => {
        console.error('Error uploading files:', err);
        this.snackBar.open('Failed to upload files', 'Close', {
          duration: 3000,
        });
        this.uploadingMedia = false;
      });

    // Reset input
    input.value = '';
  }

  deleteMedia(media: Media): void {
    if (
      confirm(
        `Are you sure you want to delete "${media.originalFilename}"? This action cannot be undone.`
      )
    ) {
      this.mediaService.delete(media.id).subscribe({
        next: () => {
          this.snackBar.open('Media deleted successfully', 'Close', {
            duration: 3000,
          });
          if (this.milestone) {
            this.loadMilestone(this.milestone.id);
          }
        },
        error: (err) => {
          console.error('Error deleting media:', err);
          this.snackBar.open('Failed to delete media', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/milestones']);
  }
}

