import { Column } from 'devextreme/ui/data_grid';
import { dataFields } from './results';

export interface Window {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  repeat: number;
  comment: string;
}

export const windowValues = [
  'page',
  'section',
  'drawingCode',
  'drawingTitle',
  'group',
  'name',
  'color',
  'repeat',
  'comment'
];

export const windowColumns: Column[] = [
  { dataField: dataFields.page, width: '50', groupIndex: 0 },
  { dataField: dataFields.section, width: '50', groupIndex: 1 },
  { dataField: dataFields.drawingCode },
  { dataField: dataFields.drawingTitle },
  { dataField: dataFields.group, width: '50', groupIndex: 2 },
  { dataField: dataFields.name },
  { dataField: dataFields.color, cellTemplate: 'cellTemplate' },
  { dataField: dataFields.repeat },
  { dataField: dataFields.comment }
];
