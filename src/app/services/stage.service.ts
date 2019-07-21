import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Performance } from '../../../classes';
import { ZenkitDataService } from './zenkit-data-service';
import { UtilityService } from './utility.service';

@Injectable()
export class StageService {

  constructor() { }

  getPerformances(zenkitCollections: any) {
    const listShortId = zenkitCollections.performances.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const performances = _.map(zenkitListData.entries, (modifiedEntry) => {
          const performance = new Performance();
          performance.shortId = modifiedEntry.shortId;
          performance.title = modifiedEntry.title;
          performance.description = modifiedEntry.description;
          performance.poster = _.head(modifiedEntry.poster);
          performance.gallery = modifiedEntry.gallery;
          if (_.isNil(modifiedEntry.date) === false) {
            performance.date = new Date(modifiedEntry.date);
          }
          if (performance.title && performance.date) {
            const dateString = UtilityService.convertDateToString(performance.date);
            performance.routerLink =
              '/auftritte/' +
              performance.shortId +
              '/' +
              UtilityService.convertStringToUrlId(performance.title) +
              '/' +
              UtilityService.convertStringToUrlId(dateString);
          } else {
            performance.routerLink = '/auftritte/' + performance.shortId;
          }
          return performance;
        });
        return performances.reverse(); // newest performances should be first
      });
  }

}
