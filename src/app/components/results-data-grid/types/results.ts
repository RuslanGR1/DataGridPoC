import { Door } from './door';
import { Room } from './room';
import { Wall } from './wall';
import { Window } from './window';

export enum ResultAnnotationType {
  WALL = 'Wall',
  ROOM = 'Room',
  WINDOW = 'Window',
  DOOR = 'Door'
}

export enum dataFields {
  page = 'page',
  section = 'section',
  name = 'name',
  drawingCode = 'drawingCode',
  drawingTitle = 'drawingTitle',
  color = 'color',
  group = 'group',
  scale = 'scale',
  length = 'length',
  type = 'type',
  ceilingHeight = 'ceilingHeight',
  area = 'area',
  repeat = 'repeat',
  comment = 'comment',
  material = 'material',
  hardware = 'hardware',
  singleDouble = 'singleDouble',
  width = 'width',
  height = 'height',
  doorLeft = 'doorLeft',
  exclusionArea = 'exclusionArea'
}

export type ResultType = Wall | Room | Window | Door;
