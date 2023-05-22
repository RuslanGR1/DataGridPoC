import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { ResultsDataGridService } from './results-data-grid.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ResultAnotationType, ResultType } from './types';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'results-data-grid',
  templateUrl: './results-data-grid.components.html',
  styleUrls: ['./results-data-grid.components.css'],
})
export class ResultsDataGridComponent {
  @ViewChild(DxDataGridComponent) dataGrid?: DxDataGridComponent;

  lastSelectedColumns: (string | undefined)[] | undefined = [];
  selectedType: ResultAnotationType = ResultAnotationType.WALL;
  resultGrid: ResultType[] = [];
  types = [
    ResultAnotationType.WALL,
    ResultAnotationType.ROOM,
    ResultAnotationType.WINDOW,
    ResultAnotationType.DOOR,
  ];

  constructor(private readonly service: ResultsDataGridService) {
    this.lastSelectedColumns = this.service.getColumnsByType(this.selectedType);
    this.resultGrid = this.service.getDataByType(this.selectedType);
  }

  onExporting(e: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Results');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        fs.saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'data.xlsx'
        );
      });
    });
    e.cancel = true;
  }

  chnageType(_event: MouseEvent, type: ResultAnotationType): void {
    this.lastSelectedColumns = this.service.getColumnsByType(type);
    setTimeout(() => {
      this.resultGrid = this.service.getDataByType(type);
      this.selectedType = type;
    });
  }
}
