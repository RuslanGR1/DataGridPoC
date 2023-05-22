import * as _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { ResultsDataGridService } from './results-data-grid.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { ResultAnotationType, ResultType } from './types';

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
  ];

  constructor(private readonly service: ResultsDataGridService) {
    this.lastSelectedColumns = this.service.getColumnsByType(this.selectedType);
    this.resultGrid = this.service.getDataByType(this.selectedType);
  }

  chnageType(_event: MouseEvent, type: ResultAnotationType): void {
    this.lastSelectedColumns = this.service.getColumnsByType(type);
    setTimeout(() => {
      this.resultGrid = this.service.getDataByType(type);
      this.selectedType = type;
    });
  }
}
