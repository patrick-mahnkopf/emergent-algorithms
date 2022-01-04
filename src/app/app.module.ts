import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmergentManagerComponent } from './emergentManager/emergent-manager.component';
import { AntsComponent } from './emergentManager/emergentAlgorithms/ants/ants.component';
import { BoidRulesService } from './emergentManager/emergentAlgorithms/boids/boid-rules.service';
import { BoidsComponent } from './emergentManager/emergentAlgorithms/boids/boids.component';
import { BottomUiService } from './emergentManager/emergentAlgorithms/boids/bottom-ui.service';
import { HeroComponent } from './emergentManager/hero/hero.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { DemoComponent } from './emergentManager/demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    FooterComponent,
    EmergentManagerComponent,
    BoidsComponent,
    AntsComponent,
    DemoComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [BoidRulesService, BottomUiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
