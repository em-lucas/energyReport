import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallLineComponent } from './ball-line/ball-line.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'page/ballline', component: BallLineComponent },
  { path: 'page/donut', component: DonutChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
