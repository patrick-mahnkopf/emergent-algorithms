import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmergentManagerComponent } from './emergentManager/emergent-manager.component';

const routes: Routes = [{ path: '', component: EmergentManagerComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
