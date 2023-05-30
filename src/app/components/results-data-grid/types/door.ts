import { Column } from 'devextreme/ui/data_grid';
import { dataFields } from './results';

export interface Door {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  type: string;
  doorLeft: string;
  material: string;
  width: string;
  height: string;
  hardware: string;
  singleDouble: string;
  repeat: number;
  comment: string;
}

export const doorValues = [
  'page',
  'section',
  'drawingCode',
  'drawingTitle',
  'group',
  'name',
  'color',
  'type',
  'material',
  'width',
  'height',
  'doorLeft',
  'hardware',
  'singleDouble',
  'repeat',
  'comment'
];

export const doorColumns: Column[] = [
  { dataField: dataFields.page, width: '50', groupIndex: 0 },
  { dataField: dataFields.section, width: '50', groupIndex: 1 },
  { dataField: dataFields.drawingCode },
  { dataField: dataFields.drawingTitle },
  { dataField: dataFields.group, width: '50', groupIndex: 2 },
  { dataField: dataFields.name },
  { dataField: dataFields.color, cellTemplate: 'cellTemplate' },
  { dataField: dataFields.type },
  { dataField: dataFields.material },
  { dataField: dataFields.width },
  { dataField: dataFields.height },
  { dataField: dataFields.doorLeft },
  { dataField: dataFields.hardware },
  { dataField: dataFields.singleDouble, caption: 'Single/Double' },
  { dataField: dataFields.repeat },
  { dataField: dataFields.comment }
];
