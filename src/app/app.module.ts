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
import { DonutChartMiddleComponent } from './donut-chart-middle/donut-chart-middle.component';
import { LineChildComponent } from './line-child/line-child.component';
import { LineGrandchildComponent } from './line-child/line-grandchild/line-grandchild.component';
import { LineDirective } from './line-child/line.directive';
import { DonutChartChildComponent } from './donut-chart/donut-chart-child/donut-chart-child.component';
import { DonutChildDirective } from './donut-chart/donut-child.directive';
import { TestComponent } from './test/test.component';
import { EnergyDirective } from './energy.directie';

@NgModule({
  declarations: [
    EnergyDirective,
    LineDirective,
    DonutChildDirective,
    AppComponent,
    ConnectTwoPointsComponent,
    BallLineComponent,
    MenuComponent,
    DraganddropComponent,
    SidebarRightComponent,
    HomePageComponent,
    DonutChartComponent,
    KeyframeTestComponent,
    DonutChartMiddleComponent,
    LineChildComponent,
    LineGrandchildComponent,
    DonutChartChildComponent,
    TestComponent
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
