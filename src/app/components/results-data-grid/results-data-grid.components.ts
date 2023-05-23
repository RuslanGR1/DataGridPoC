import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { ResultsDataGridService } from './results-data-grid.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ResultAnotationType, ResultType } from './types';
import { exportDataGrid } from 'devextreme/excel_exporter';
import assetsResults from '../../../assets/results.json';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'results-data-grid',
  templateUrl: './results-data-grid.components.html',
  styleUrls: ['./results-data-grid.components.css']
})
export class ResultsDataGridComponent {
  @ViewChild(DxDataGridComponent) dataGrid?: DxDataGridComponent;

  resultsData: any = null;
  lastSelectedColumns: (string | undefined)[] | undefined = [];
  selectedType: ResultAnotationType = ResultAnotationType.WALL;
  defaultAnnotationType: ResultAnotationType = ResultAnotationType.WALL;
  resultGrid: ResultType[] = [];
  types = [ResultAnotationType.WALL, ResultAnotationType.ROOM, ResultAnotationType.WINDOW, ResultAnotationType.DOOR];

  constructor(private readonly service: ResultsDataGridService) {
    this.resultsData = assetsResults;
    this.lastSelectedColumns = this.service.getColumnsByType(this.selectedType);
    this.resultGrid = this.service.getDataByType(this.selectedType, this.resultsData);
  }

  onExporting(e: any) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Results');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        fs.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'data.xlsx');
      });
    });
    e.cancel = true;
  }

  async processFile(fileInput: any): Promise<void> {
    const file: File = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(file);
  }

  onReaderLoad = (ev: ProgressEvent<FileReader>) => {
    const obj = JSON.parse(<string>ev.target?.result);
    this.resultsData = obj;
    this.selectedType = this.defaultAnnotationType;
    this.lastSelectedColumns = this.service.getColumnsByType(this.defaultAnnotationType);
    this.resultGrid = this.service.getDataByType(this.defaultAnnotationType, this.resultsData);
  };

  changeResultType(_event: MouseEvent, type: ResultAnotationType): void {
    this.lastSelectedColumns = this.service.getColumnsByType(type);
    this.resultGrid = this.service.getDataByType(type, this.resultsData);
    this.selectedType = type;
  }
}
