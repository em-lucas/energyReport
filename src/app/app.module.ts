import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ConnectTwoPointsComponent } from './connect-two-points/connect-two-points.component';
import { BallLineComponent } from './ball-line/ball-line.component';
import { EnergyService } from './energy.service';
import { MenuComponent } from './menu/menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DraganddropComponent } from './draganddrop/draganddrop.component';
import { SidebarRightComponent } from './sidebar-right/sidebar-right.component';
import { HomePageComponent } from './home-page/home-page.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { KeyframeTestComponent } from './keyframe-test/keyframe-test.component';

@NgModule({
  declarations: [
    AppComponent,
    ConnectTwoPointsComponent,
    BallLineComponent,
    MenuComponent,
    DraganddropComponent,
    SidebarRightComponent,
    HomePageComponent,
    DonutChartComponent,
    KeyframeTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,    
  ],
  providers: [EnergyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
