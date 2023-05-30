import { Column } from 'devextreme/ui/data_grid';
import { dataFields } from './results';

export interface Wall {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  scale: number | undefined;
  length: number;
  ceilingHeight: string;
  type: string;
}

export const wallValues = [
  'page',
  'section',
  'drawingCode',
  'drawingTitle',
  'name',
  'group',
  'color',
  'scale',
  'length',
  'ceilingHeight',
  'type'
];

export const wallColumns: Column[] = [
  { dataField: dataFields.page, width: '50', groupIndex: 0 },
  { dataField: dataFields.section, width: '50', groupIndex: 1 },
  { dataField: dataFields.drawingCode },
  { dataField: dataFields.drawingTitle },
  { dataField: dataFields.group, width: '50', groupIndex: 2 },
  { dataField: dataFields.name },
  { dataField: dataFields.color, cellTemplate: 'cellTemplate' },
  { dataField: dataFields.scale },
  { dataField: dataFields.length },
  { dataField: dataFields.ceilingHeight },
  { dataField: dataFields.type }
];
