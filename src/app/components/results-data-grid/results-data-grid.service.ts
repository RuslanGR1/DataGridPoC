import * as _ from 'lodash';
import { Injectable } from '@angular/core';
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
  doorValues
} from './types';

@Injectable({ providedIn: 'root' })
export class ResultsDataGridService {
  private getSectionNameById(pageNumber: number, id: string, results: any) {
    const params = results.documentProcessingParams.pageProcessingModels.find(
      (model: any) => model.pageNumber === pageNumber
    );
    const section = params?.pageSections.find((section: any) => section.id === id);
    return section;
  }

  private readonly mapTypeToData: Record<ResultAnotationType, (res: any) => ResultType[]> = {
    [ResultAnotationType.WALL]: (res) => this.getWalls(res),
    [ResultAnotationType.ROOM]: (res) => this.getRooms(res),
    [ResultAnotationType.WINDOW]: (res) => this.getWindows(res),
    [ResultAnotationType.DOOR]: (res) => this.getDoors(res)
  };
  getDataByType(type: ResultAnotationType, results: any): ResultType[] {
    return this.mapTypeToData[type](results);
  }

  private readonly mapTypeToColumns: Record<ResultAnotationType, string[]> = {
    [ResultAnotationType.WALL]: wallValues,
    [ResultAnotationType.ROOM]: roomValues,
    [ResultAnotationType.WINDOW]: windowValues,
    [ResultAnotationType.DOOR]: doorValues
  };
  getColumnsByType(type: ResultAnotationType): string[] {
    return this.mapTypeToColumns[type];
  }

  private getDoorById(doorId: string, results: any) {
    const pageDoorDetectionResults = results.pageProcessingResults.map(
      (pageResult: any) => pageResult.doorsDetectionResults
    );
    const doors = _.flatten(pageDoorDetectionResults).map((result: any) => result.doorsResults);
    const door = _.flatten(doors).find((res) => res.id === doorId);
    return door;
  }

  private getWallById(wallId: string, results: any) {
    const pageWallDetectionResults = results.pageProcessingResults.map(
      (pageResult: any) => pageResult.wallsDetectionResults
    );
    const wallsObject = {};
    _.flatten<any>(pageWallDetectionResults).forEach((result) => Object.assign(wallsObject, result.walls.wallsResults));
    return _.get(wallsObject, wallId);
  }

  private getLenghtByJointIds(j1Id: string, j2Id: string, results: any) {
    const pageWallDetectionResults = results.pageProcessingResults.map(
      (pageResult: any) => pageResult.wallsDetectionResults
    );
    const jointsObject = {};
    _.flatten<any>(pageWallDetectionResults).forEach((result) =>
      Object.assign(jointsObject, result.joints.jointsResults)
    );
    const { x: x1, y: y1 } = _.get(jointsObject, j1Id);
    const { x: x2, y: y2 } = _.get(jointsObject, j2Id);
    const a = x1 - x2;
    const b = y1 - y2;
    const rawLenght = Math.sqrt(a * a + b * b);
    return Math.ceil(rawLenght * 100) / 100;
  }

  getDoors(results: any): Door[] {
    const doors: Door[] = [];
    results.pageProcessingResults?.forEach((result: any) => {
      result.doorsDetectionResults?.forEach((doorResults: any) => {
        doorResults.doorGroups?.forEach((doorGroup: any) => {
          doorGroup.doors?.forEach((doorId: string) => {
            const door = this.getDoorById(doorId, results);
            const section = this.getSectionNameById(result.pageNumber, doorGroup.sectionId, results);
            if (!section || !door) {
              return;
            }
            doors.push({
              page: result.pageNumber,
              section: section.name,
              drawingCode: '',
              drawingTitle: '',
              name: `Door ${door.number}`,
              group: doorGroup.name,
              color: doorGroup.color,
              type: doorGroup.doorType,
              doorLeft: door.doorLeft,
              material: doorGroup.doorMaterial,
              width: '',
              height: '',
              singleDouble: door.doorSingle,
              hardware: doorGroup.doorHardware,
              repeat: section.numberOfReportEntries,
              comment: ''
            });
          });
        });
      });
    });
    return doors;
  }

  getRooms(results: any): Room[] {
    const rooms: Room[] = [];
    results.pageProcessingResults?.forEach((result: any) => {
      result.roomsDetectionResults?.forEach((roomResults: any) => {
        roomResults.roomGroups?.forEach((roomGroup: any) => {
          roomGroup.rooms?.forEach((_roomId: string, index: number) => {
            const section = this.getSectionNameById(result.pageNumber, roomGroup.sectionId, results);
            if (!section) {
              return;
            }
            rooms.push({
              page: result.pageNumber,
              section: section.name,
              drawingCode: '',
              drawingTitle: '',
              name: `Room ${index + 1}`,
              group: roomGroup.name,
              color: roomGroup.color,
              scale: section.scale,
              ceilingHeight: roomGroup.height || '',
              area: '',
              exclusionArea: ''
            });
          });
        });
      });
    });
    return rooms;
  }

  getWindows(results: any): Window[] {
    let windows: Window[] = [];
    results.pageProcessingResults?.forEach((result: any) => {
      result.windowsDetectionResults?.forEach((windowResults: any) => {
        windowResults.windowGroups?.forEach((windowGroup: any) => {
          windowGroup.windows?.forEach((_windowId: string, index: number) => {
            const section = this.getSectionNameById(result.pageNumber, windowGroup.sectionId, results);
            if (!section) {
              return;
            }
            windows.push({
              page: result.pageNumber,
              section: section.name,
              drawingCode: '',
              drawingTitle: '',
              name: `Window ${index + 1}`,
              group: windowGroup.name,
              color: windowGroup.color,
              repeat: section?.numberOfReportEntries,
              comment: ''
            });
          });
        });
      });
    });
    return windows;
  }

  getWalls(results: any): Wall[] {
    let walls: Wall[] = [];
    results.pageProcessingResults?.forEach((result: any) => {
      result.wallsDetectionResults?.forEach((wallsResult: any) => {
        wallsResult.customWallGroups?.forEach((wallGroup: any) => {
          wallGroup.walls?.forEach((wallId: string, index: number) => {
            const { j1, j2 } = this.getWallById(wallId, results);
            const lenght = this.getLenghtByJointIds(j1, j2, results);
            const section = this.getSectionNameById(result.pageNumber, wallGroup.sectionId, results);
            if (!section) {
              return;
            }
            walls.push({
              page: result.pageNumber,
              section: section.name,
              drawingCode: '',
              drawingTitle: '',
              name: `Wall ${index + 1}`,
              group: wallGroup.name,
              color: wallGroup?.color,
              scale: section.scale * section.scale,
              length: lenght,
              ceilingHeight: wallGroup?.height,
              type: wallGroup.type
            });
          });
        });
      });
    });

    return walls;
  }
}
