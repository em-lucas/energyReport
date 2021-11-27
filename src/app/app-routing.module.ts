import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BallLineComponent } from './ball-line/ball-line.component';
import { DonutChartComponent } from './donut-chart/donut-chart.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KeyframeTestComponent } from './keyframe-test/keyframe-test.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'page/ballline', component: BallLineComponent },
  { path: 'page/keyFrame', component: KeyframeTestComponent },
  { path: 'page/donut/:id', component: DonutChartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
