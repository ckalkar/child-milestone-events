import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchUploadComponent } from './batch-upload.component';

const routes: Routes = [
  {
    path: '',
    component: BatchUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchUploadRoutingModule {}
