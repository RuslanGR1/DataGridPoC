export interface Room {
  page: number;
  section: string;
  drawingCode: string;
  drawingTitle: string;
  group: string;
  name: string;
  color: string;
  scale: string;
  ceilingHeight: string;
  area: string;
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
  'exclusionArea',
];
