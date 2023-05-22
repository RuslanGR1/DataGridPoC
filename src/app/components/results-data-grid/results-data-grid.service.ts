import { Injectable } from '@angular/core';
import results from '../../../assets/results.json';
import {
  ResultAnotationType,
  ResultType,
  Room,
  Wall,
  Window,
  Door,
  roomValues,
  wallValues,
  windowValues,
  doorValues,
} from './types';

@Injectable({ providedIn: 'root' })
export class ResultsDataGridService {
  private getSectionNameById(pageNumber: number, id: string): string | void {
    const params = results.documentProcessingParams.pageProcessingModels.find(
      (model) => model.pageNumber === pageNumber
    );
    const section = params?.pageSections.find((section) => section.id === id);
    return section?.name;
  }

  private readonly mapTypeToData: Record<
    ResultAnotationType,
    () => ResultType[]
  > = {
    [ResultAnotationType.WALL]: () => this.getWalls(),
    [ResultAnotationType.ROOM]: () => this.getRooms(),
    [ResultAnotationType.WINDOW]: () => this.getWindows(),
    [ResultAnotationType.DOOR]: () => this.getDoors(),
  };
  getDataByType(type: ResultAnotationType): ResultType[] {
    return this.mapTypeToData[type]();
  }

  private readonly mapTypeToColumns: Record<ResultAnotationType, string[]> = {
    [ResultAnotationType.WALL]: wallValues,
    [ResultAnotationType.ROOM]: roomValues,
    [ResultAnotationType.WINDOW]: windowValues,
    [ResultAnotationType.DOOR]: doorValues,
  };
  getColumnsByType(type: ResultAnotationType): string[] {
    return this.mapTypeToColumns[type];
  }

  private getWallById(wallId: string) {
    let wall: any;
    results.pageProcessingResults.forEach((page) => {
      page.wallsDetectionResults.forEach((wall) => {
        // @ts-ignore
        wall = wall?.walls?.wallsResults[wallId];
      });
    });
    return wall;
  }

  getDoors(): Door[] {
    const doors: Door[] = [];
    results.pageProcessingResults.forEach((result) => {
      result.doorsDetectionResults.forEach((doorResults) => {
        doorResults.doorGroups.forEach((doorGroup) => {
          doorGroup.doors.forEach((_doorId, index) => {
            doors.push({
              page: result.pageNumber,
              section:
                this.getSectionNameById(
                  result.pageNumber,
                  doorGroup.sectionId
                ) || '',
              drawingCode: '',
              drawingTitle: '',
              name: `Door ${index + 1}`,
              group: doorGroup.name,
              color: doorGroup.color,
              type: '',
              material: '',
              width: '',
              height: '',
              singleDouble: '',
              hardware: '',
              repeat: 1,
              comment: '',
            });
          });
        });
      });
    });
    return doors;
  }

  getRooms(): Room[] {
    const rooms: Room[] = [];
    results.pageProcessingResults.forEach((result) => {
      result.roomsDetectionResults.forEach((roomResults) => {
        roomResults.roomGroups.forEach((roomGroup) => {
          roomGroup.rooms.forEach((_roomId, index) => {
            rooms.push({
              page: result.pageNumber,
              section:
                this.getSectionNameById(
                  result.pageNumber,
                  roomGroup.sectionId
                ) || '',
              drawingCode: '',
              drawingTitle: '',
              name: `Room ${index + 1}`,
              group: roomGroup.name,
              color: roomGroup.color,
              scale: '',
              ceilingHeight: roomGroup.height || '',
              area: '',
              exclusionArea: '',
            });
          });
        });
      });
    });
    return rooms;
  }

  getWindows(): Window[] {
    let windows: Window[] = [];
    results.pageProcessingResults.forEach((result) => {
      result.windowsDetectionResults.forEach((windowResults) => {
        windowResults.windowGroups.forEach((windowGroup) => {
          windowGroup.windows.forEach((_windowId, index) => {
            windows.push({
              page: result.pageNumber,
              section:
                this.getSectionNameById(
                  result.pageNumber,
                  windowGroup.sectionId
                ) || '',
              drawingCode: '',
              drawingTitle: '',
              name: `Window ${index + 1}`,
              group: windowGroup.name,
              color: windowGroup.color,
              repeat: 3,
              comment: '',
            });
          });
        });
      });
    });
    return windows;
  }

  getWalls(): Wall[] {
    let walls: Wall[] = [];
    results.pageProcessingResults.map((result) => {
      let wallObject: Wall;
      result.wallsDetectionResults.forEach((wallsResult) => {
        wallsResult.customWallGroups.forEach((wallGroup) => {
          wallGroup.walls.forEach((_wallId, index) => {
            wallObject = {
              page: result.pageNumber,
              section:
                this.getSectionNameById(
                  result.pageNumber,
                  wallGroup.sectionId
                ) || '',
              drawingCode: '',
              drawingTitle: '',
              name: `Wall ${index + 1}`,
              group: wallGroup.name,
              color: wallGroup?.color,
              scale: '',
              length: '',
              ceilingHeight: wallGroup?.height,
              type: wallGroup.type,
            };
            walls.push(wallObject);
          });
        });
      });
    });

    return walls;
  }
}
