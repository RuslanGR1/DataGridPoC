import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ResultsDataGridComponent } from './components/results-data-grid/results-data-grid.components';
import { DxBulletModule, DxButtonModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, ResultsDataGridComponent],
  imports: [
    BrowserModule,
    DxButtonModule,
    DxDataGridModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxBulletModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
