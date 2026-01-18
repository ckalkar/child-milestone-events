import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { MilestoneFormComponent } from './milestone-form/milestone-form.component';
import { MilestoneDetailComponent } from './milestone-detail/milestone-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MilestonesListComponent,
  },
  {
    path: 'new',
    component: MilestoneFormComponent,
  },
  {
    path: ':id',
    component: MilestoneDetailComponent,
  },
  {
    path: ':id/edit',
    component: MilestoneFormComponent,
  },
];

@NgModule({
  declarations: [
    MilestonesListComponent,
    MilestoneFormComponent,
    MilestoneDetailComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MilestonesModule {}

