import { NgModule } from '@angular/core';
import { AccessComponent } from './components/access.component';
import { CommonModule } from '@angular/common';
import { AccessRoutingModule } from './access-routing.module';

@NgModule({
  declarations: [AccessComponent],
  imports: [CommonModule, AccessRoutingModule],
  providers: [],
})
export class AccessModule {}
