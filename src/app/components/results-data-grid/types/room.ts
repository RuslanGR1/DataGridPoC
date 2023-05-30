import { Column } from 'devextreme/ui/data_grid';
import { dataFields } from './results';

export interface Room {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  scale: number | undefined;
  ceilingHeight: string;
  area: number;
  exclusionArea: string;
}

export const roomValues = [
  'page',
  'section',
  'drawingCode',
  'drawingTitle',
  'group',
  'color',
  'name',
  'scale',
  'ceilingHeight',
  'area',
  'exclusionArea'
];

export const roomColumns: Column[] = [
  { dataField: dataFields.page, width: '50', groupIndex: 0 },
  { dataField: dataFields.section, width: '50', groupIndex: 1 },
  { dataField: dataFields.drawingCode },
  { dataField: dataFields.drawingTitle },
  { dataField: dataFields.group, width: '50', groupIndex: 2 },
  { dataField: dataFields.name },
  { dataField: dataFields.color, cellTemplate: 'cellTemplate' },
  { dataField: dataFields.scale },
  { dataField: dataFields.ceilingHeight },
  { dataField: dataFields.area },
  { dataField: dataFields.exclusionArea }
];
