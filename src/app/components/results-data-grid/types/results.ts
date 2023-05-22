import { Room } from './room';
import { Wall } from './wall';
import { Window } from './window';

export enum ResultAnotationType {
  WALL = 'Wall',
  ROOM = 'Room',
  WINDOW = 'Window',
}

export type ResultType = Wall | Room | Window;
