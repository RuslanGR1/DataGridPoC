export interface Wall {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  scale: string;
  length: string;
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
  'type',
];
