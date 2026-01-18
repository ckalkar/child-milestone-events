import { Component, OnInit } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { Media } from '../../models/media.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  media: Media[] = [];
  loading = true;
  uploadingMedia = false;
  selectedTab = 0; // 0 = All, 1 = Photos, 2 = Videos

  constructor(
    public mediaService: MediaService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.loading = true;

    let fileType: 'image' | 'video' | undefined;
    if (this.selectedTab === 1) {
      fileType = 'image';
    } else if (this.selectedTab === 2) {
      fileType = 'video';
    }

    this.mediaService.getGallery(fileType).subscribe({
      next: (media) => {
        this.media = media;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading gallery:', err);
        this.snackBar.open('Failed to load gallery', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  onTabChange(index: number): void {
    this.selectedTab = index;
    this.loadGallery();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.uploadingMedia = true;
    const files = Array.from(input.files);

    const uploadPromises = files.map((file) => {
      const metadata = {
        takenDate: new Date().toISOString(),
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
        this.loadGallery();
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

  deleteMedia(media: Media, event: Event): void {
    event.stopPropagation();

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
          this.loadGallery();
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

  openMedia(media: Media): void {
    window.open(this.mediaService.getMediaUrl(media), '_blank');
  }

  getFilteredMedia(): Media[] {
    return this.media;
  }
}

