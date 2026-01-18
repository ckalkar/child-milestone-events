import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/timeline', pathMatch: 'full' },
  {
    path: 'timeline',
    loadChildren: () =>
      import('./pages/timeline/timeline.module').then((m) => m.TimelineModule),
  },
  {
    path: 'milestones',
    loadChildren: () =>
      import('./pages/milestones/milestones.module').then(
        (m) => m.MilestonesModule
      ),
  },
  {
    path: 'gallery',
    loadChildren: () =>
      import('./pages/gallery/gallery.module').then((m) => m.GalleryModule),
  },
  {
    path: 'batch-upload',
    loadChildren: () =>
      import('./pages/batch-upload/batch-upload.module').then(
        (m) => m.BatchUploadModule
      ),
  },
  { path: '**', redirectTo: '/timeline' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

