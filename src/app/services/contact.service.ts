import { RequiredElementsConfig } from '../constants/required-elements-config';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UtilityService } from './utility.service';
import { ZenkitDataService } from './zenkit-data-service';
import { Contact } from '../../../classes';

@Injectable()
export class ContactService {

  constructor() { }

  getContact(zenkitCollections: any) {
    const listShortId = zenkitCollections.contact.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const modifiedEntry: any = _.head(zenkitListData.entries);
        const contact = new Contact();
        contact.name = modifiedEntry.name;
        contact.name2 = modifiedEntry.name2;
        contact.email = modifiedEntry.email;
        contact.phone = modifiedEntry.phone;
        contact.phone2 = modifiedEntry.phone2;
        contact.imprint = modifiedEntry.imprint;
        contact.description = modifiedEntry.description;
        contact.image = _.head(modifiedEntry.image);
        return contact;
      });
  }

}
