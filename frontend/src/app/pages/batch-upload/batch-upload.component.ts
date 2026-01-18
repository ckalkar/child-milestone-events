import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BatchUploadService } from '../../services/batch-upload.service';
import { CategoryService } from '../../services/category.service';
import {
  BatchUploadRequest,
  BatchMilestoneData,
  BatchMediaFile,
} from '../../models/batch-upload.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss'],
})
export class BatchUploadComponent implements OnInit, OnDestroy {
  batchForm: FormGroup;
  selectedFiles: File[] = [];
  categories: Category[] = [];
  isLoading = false;
  isValidating = false;
  isUploading = false;
  validationErrors: string[] = [];
  uploadSuccess = false;
  uploadFailures: Array<{ milestone: string; error: string }> = [];
  uploadSummary: any = null;
  uploadedMilestones: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private batchUploadService: BatchUploadService,
    private categoryService: CategoryService,
  ) {
    this.batchForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadTemplate();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      milestones: this.formBuilder.array([this.createMilestoneGroup()]),
    });
  }

  private createMilestoneGroup(): FormGroup {
    return this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      eventDate: ['', Validators.required],
      categoryId: [''],
      notes: [''],
      isMajor: [false],
      mediaFiles: this.formBuilder.array([]),
    });
  }

  private createMediaFileGroup(): FormGroup {
    return this.formBuilder.group({
      filename: ['', Validators.required],
      caption: [''],
      takenDate: [''],
    });
  }

  get milestonesArray(): FormArray {
    return this.batchForm.get('milestones') as FormArray;
  }

  addMilestone(): void {
    this.milestonesArray.push(this.createMilestoneGroup());
  }

  removeMilestone(index: number): void {
    this.milestonesArray.removeAt(index);
  }

  getMediaFilesArray(index: number): FormArray {
    return this.milestonesArray.at(index).get('mediaFiles') as FormArray;
  }

  addMediaFile(milestoneIndex: number): void {
    this.getMediaFilesArray(milestoneIndex).push(this.createMediaFileGroup());
  }

  removeMediaFile(milestoneIndex: number, mediaIndex: number): void {
    this.getMediaFilesArray(milestoneIndex).removeAt(mediaIndex);
  }

  onFilesSelected(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
    
    // Auto-populate filenames in the first milestone's media files
    if (this.selectedFiles.length > 0 && this.milestonesArray.length > 0) {
      const firstMilestoneMediaArray = this.getMediaFilesArray(0);
      firstMilestoneMediaArray.clear();
      
      this.selectedFiles.forEach((file: any) => {
        const mediaGroup = this.createMediaFileGroup();
        mediaGroup.patchValue({ filename: file.name });
        firstMilestoneMediaArray.push(mediaGroup);
      });
    }
  }

  loadCategories(): void {
    this.categoryService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Failed to load categories:', error);
        },
      });
  }

  loadTemplate(): void {
    this.batchUploadService
      .getBatchTemplate()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Template loaded for reference
          console.log('Batch template loaded:', response.template);
        },
        error: (error) => {
          console.error('Failed to load template:', error);
        },
      });
  }

  validateBatch(): void {
    if (this.selectedFiles.length === 0) {
      this.validationErrors = ['Please select files to upload'];
      return;
    }

    if (!this.batchForm.valid) {
      this.validationErrors = ['Please fill in all required milestone fields'];
      return;
    }

    this.isValidating = true;
    this.validationErrors = [];

    const batchData: BatchUploadRequest = this.prepareBatchData();

    this.batchUploadService
      .validateBatch(this.selectedFiles, batchData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isValidating = false;
          if (response.valid) {
            this.validationErrors = [];
            alert(
              `Validation successful! ${response.fileCount} files, ${response.milestoneCount} milestones.`,
            );
          } else {
            this.validationErrors = response.errors;
          }
        },
        error: (error) => {
          this.isValidating = false;
          this.validationErrors = [error.message];
        },
      });
  }

  performUpload(): void {
    if (this.selectedFiles.length === 0) {
      this.validationErrors = ['Please select files to upload'];
      return;
    }

    if (!this.batchForm.valid) {
      this.validationErrors = ['Please fill in all required milestone fields'];
      return;
    }

    this.isUploading = true;
    this.uploadSuccess = false;
    this.uploadFailures = [];
    this.uploadSummary = null;
    this.uploadedMilestones = [];

    const batchData: BatchUploadRequest = this.prepareBatchData();

    this.batchUploadService
      .uploadBatch(this.selectedFiles, batchData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadSuccess = response.success;
          this.uploadSummary = response.summary;
          this.uploadFailures = response.failures;
          this.uploadedMilestones = response.data.milestones;

          if (response.success) {
            alert('Batch upload completed successfully!');
            this.resetForm();
          }
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadSuccess = false;
          this.validationErrors = [error.message];
        },
      });
  }

  private prepareBatchData(): BatchUploadRequest {
    const formValue = this.batchForm.value;
    return {
      milestones: formValue.milestones.map(
        (milestone: any): BatchMilestoneData => ({
          title: milestone.title,
          description: milestone.description || undefined,
          eventDate: milestone.eventDate,
          categoryId: milestone.categoryId || undefined,
          notes: milestone.notes || undefined,
          isMajor: milestone.isMajor || false,
          mediaFiles: (milestone.mediaFiles || []).map(
            (media: any): BatchMediaFile => ({
              filename: media.filename,
              caption: media.caption || undefined,
              takenDate: media.takenDate || undefined,
            }),
          ),
        }),
      ),
    };
  }

  resetForm(): void {
    this.batchForm = this.initializeForm();
    this.selectedFiles = [];
    this.validationErrors = [];
    this.uploadFailures = [];
    this.uploadSummary = null;
    this.uploadedMilestones = [];
  }

  downloadErrorReport(): void {
    const report = this.uploadFailures
      .map((failure) => `${failure.milestone}: ${failure.error}`)
      .join('\n');
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch-upload-errors.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
