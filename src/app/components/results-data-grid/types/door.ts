export interface Door {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  type: string;
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
  'hardware',
  'singleDouble',
  'repeat',
  'comment',
];
