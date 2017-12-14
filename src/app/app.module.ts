import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { DrugDetailsComponent } from './drug-details/drug-details.component';
import {DataLoaderService} from './services/data-loader.service';
import {HttpClientModule} from '@angular/common/http';
import {MaterialModule} from '../assets/material/material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DrugHoverService} from './services/drug-hover.service';
import { DrugChartsComponent } from './drug-charts/drug-charts.component';
import {FilterService} from "./services/filter.service";


@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    DrugDetailsComponent,
    DrugChartsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    DataLoaderService,
    DrugHoverService,
    FilterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
