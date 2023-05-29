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

export type ResultType = Wall | Room | Window | Door;
