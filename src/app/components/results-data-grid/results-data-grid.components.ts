import { Component, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import fs from 'file-saver';
import * as _ from 'lodash';
import assetsResults from '../../../assets/results.json';
import { ResultsDataGridService } from './results-data-grid.service';
import { ResultAnnotationType, ResultType, doorColumns, roomColumns, wallColumns, windowColumns } from './types';
import { Column } from 'devextreme/ui/data_grid';

@Component({
  selector: 'results-data-grid',
  templateUrl: './results-data-grid.components.html',
  styleUrls: ['./results-data-grid.components.css']
})
export class ResultsDataGridComponent {
  @ViewChild(DxDataGridComponent) dataGrid?: DxDataGridComponent;

  columns: Column[];
  resultsData: any = null;
  defaultAnnotationType: ResultAnnotationType = ResultAnnotationType.WALL;
  selectedType: ResultAnnotationType = this.defaultAnnotationType;
  resultGrid: ResultType[] = [];
  columnCalcFunction: string = '';
  types = [
    ResultAnnotationType.WALL,
    ResultAnnotationType.ROOM,
    ResultAnnotationType.WINDOW,
    ResultAnnotationType.DOOR
  ];
  newColumnName: string = '';

  constructor(readonly service: ResultsDataGridService) {
    this.resultsData = assetsResults;
    this.columns = this.getColumnsByType(this.selectedType);
    this.resultGrid = this.service.getDataByType(this.selectedType, this.resultsData);
  }

  changedData: Record<ResultAnnotationType | string, any> = {
    [ResultAnnotationType.DOOR]: {},
    [ResultAnnotationType.WALL]: {},
    [ResultAnnotationType.WINDOW]: {},
    [ResultAnnotationType.ROOM]: {}
  };

  changedColumns: Record<ResultAnnotationType | string, Column[]> = {
    [ResultAnnotationType.DOOR]: doorColumns,
    [ResultAnnotationType.WALL]: wallColumns,
    [ResultAnnotationType.WINDOW]: windowColumns,
    [ResultAnnotationType.ROOM]: roomColumns
  };
  getColumnsByType(type: string): Column[] {
    return this.changedColumns[type];
  }

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

  async processConfigFile(fileInput: any): Promise<void> {
    const file: File = fileInput.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.onloadend = () => {
      if (typeof fileReader?.result === 'string') {
        const state = JSON.parse(fileReader.result);
        this.dataGrid?.instance.state(state);
      }
    };
    fileReader.readAsText(file);
  }

  async processFile(fileInput: any): Promise<void> {
    const file: File = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = this.onReaderLoad;
    reader.readAsText(file);
  }

  saveState(): void {
    const state = this.dataGrid?.instance.state();
    const blob = new Blob([JSON.stringify(state)], { type: 'text/plain;charset=utf-8' });
    fs.saveAs(blob, 'state.json');
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

  addEmptyColumn(): void {
    let calculateValue: ((data: any) => string | number) | undefined;
    if (this.columnCalcFunction) {
      calculateValue = eval(`
        (function(data) {
            return ${this.columnCalcFunction}
        })
      `);
    } else {
      calculateValue = undefined;
    }

    const newColumn: Column = {
      caption: this.newColumnName,
      fixed: false,
      calculateCellValue: (data) => calculateValue && calculateValue(data)
    };
    this.columns.push(newColumn);
    this.newColumnName = '';
    this.columnCalcFunction = '';
  }

  onReaderLoad = (ev: ProgressEvent<FileReader>) => {
    const obj = JSON.parse(<string>ev.target?.result);
    this.resultsData = obj;
    this.selectedType = this.defaultAnnotationType;
    this.resultGrid = this.service.getDataByType(this.defaultAnnotationType, this.resultsData);
  };

  changeResultType(_event: MouseEvent, type: ResultAnnotationType): void {
    this.dataGrid?.instance.clearGrouping();
    this.columns = this.getColumnsByType(type);

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
