import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BatchUploadComponent } from './batch-upload.component';
import { BatchUploadRoutingModule } from './batch-upload-routing.module';

@NgModule({
  declarations: [BatchUploadComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BatchUploadRoutingModule,
  ],
})
export class BatchUploadModule {}
