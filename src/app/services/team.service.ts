import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Teacher } from '../../../classes';
import { UtilityService } from './utility.service';
import { ZenkitDataService } from './zenkit-data-service';

@Injectable()
export class TeamService {

  constructor(
  ) { }

  getTeam(zenkitCollections: any) {
    const listShortId = zenkitCollections.team.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const team = _.map(zenkitListData.entries, (modifiedEntry) => {
          const teacher = new Teacher();
          teacher.uuid = modifiedEntry.uuid;
          teacher.firstName = modifiedEntry.firstName;
          teacher.lastName = modifiedEntry.lastName;
          teacher.task = modifiedEntry.task;
          teacher.description = modifiedEntry.description;
          teacher.image = _.head(modifiedEntry.image);
          return teacher;
        });
        return team;
      });
  }

  convertTeacherToUrlId(teacher: Teacher) {
    const convertedFirstName = UtilityService.convertStringToUrlId(teacher.firstName);
    const convertedLastName = UtilityService.convertStringToUrlId(teacher.lastName);
    return convertedFirstName + '-' + convertedLastName;
  }
}
