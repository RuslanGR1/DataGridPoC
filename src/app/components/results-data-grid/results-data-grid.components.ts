import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { ResultsDataGridService } from './results-data-grid.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ResultAnotationType, ResultType } from './types';
import { exportDataGrid } from 'devextreme/excel_exporter';
import assetsResults from '../../../assets/results.json';
import { Workbook } from 'exceljs';
import fs from 'file-saver';

@Component({
  selector: 'results-data-grid',
  templateUrl: './results-data-grid.components.html',
  styleUrls: ['./results-data-grid.components.css']
})
export class ResultsDataGridComponent {
  @ViewChild(DxDataGridComponent) dataGrid?: DxDataGridComponent;

  resultsData: any = null;
  lastSelectedColumns: (string | undefined)[] | undefined = [];
  defaultAnnotationType: ResultAnotationType = ResultAnotationType.WALL;
  selectedType: ResultAnotationType = this.defaultAnnotationType;
  resultGrid: ResultType[] = [];
  types = [ResultAnotationType.WALL, ResultAnotationType.ROOM, ResultAnotationType.WINDOW, ResultAnotationType.DOOR];

  constructor(readonly service: ResultsDataGridService) {
    this.resultsData = assetsResults;
    this.lastSelectedColumns = this.service.getColumnsByType(this.selectedType);
    this.resultGrid = this.service.getDataByType(this.selectedType, this.resultsData);
  }

  changedData: Record<ResultAnotationType, any> = {
    [ResultAnotationType.DOOR]: {},
    [ResultAnotationType.WALL]: {},
    [ResultAnotationType.WINDOW]: {},
    [ResultAnotationType.ROOM]: {}
  };

  onDataSave(): void {
    this.changedData[this.selectedType] = this.resultGrid;
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

  calculateSelectedRow(options: any) {
    if (options.name === 'SelectedRowsSummary') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      } else if (options.summaryProcess === 'calculate') {
        if (options.component.isRowSelected(options.value.ID)) {
          options.totalValue += options.value.area;
        }
      }
    }
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

    // Save page results to not parse all data everytime
    if (!_.isEmpty(this.changedData[type])) {
      this.resultGrid = this.changedData[type];
    } else {
      const data = this.service.getDataByType(type, this.resultsData);
      this.changedData[type] = data;
      this.resultGrid = data;
    }

    this.selectedType = type;
  }
}
