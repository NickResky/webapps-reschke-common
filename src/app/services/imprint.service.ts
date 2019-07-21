import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import { Imprint, Teacher } from '../../../classes';
import { UtilityService } from './utility.service';
import { ZenkitDataService } from './zenkit-data-service';

@Injectable()
export class ImprintService {

  constructor() { }

  getEntries(zenkitCollections: any) {
    const listShortId = zenkitCollections.imprint.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const entries = _.map(zenkitListData.entries, (modifiedEntry) => {
          const entry = new Imprint();
          entry.title = modifiedEntry.title;
          entry.description = modifiedEntry.description;
          return entry;
        });
        return entries;
      });
  }
}
