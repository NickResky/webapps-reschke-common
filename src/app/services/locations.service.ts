import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {  Appointment, LocationData, Location } from '../../../classes';
import { UtilityService } from './utility.service';
import { ZenkitDataService } from './zenkit-data-service';

@Injectable()
export class LocationsService {

  constructor() { }

  getLocationData(zenkitCollections: any) {
    const listShortId = zenkitCollections.locations.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const locations = this.transformZenkitEntriesToLocations(zenkitListData);
        const locationMG = _.find(locations, {
          initials: 'MG'
        });
        const locationLB = _.find(locations, {
          initials: 'LB'
        });
        const locationData = new LocationData();
        locationData.locationMG = locationMG;
        locationData.locationLB = locationLB;
    
        return locationData;
    });
  }

  transformZenkitEntriesToLocations(zenkitListData: any) {
    const locations = _.map(zenkitListData.entries, (modifiedEntry) => {
      const location = new Location();
      location.uuid = modifiedEntry.uuid;
      location.shortId = modifiedEntry.shortId;
      location.name = modifiedEntry.name;
      location.addressName = modifiedEntry.addressName;
      location.addressStreet = modifiedEntry.addressStreet;
      location.addressZIP = modifiedEntry.addressZIP;
      location.addressCity = modifiedEntry.addressCity;
      location.description = modifiedEntry.description;
      location.image = _.head(modifiedEntry.image);
      location.gallery = modifiedEntry.gallery;
      location.embed = modifiedEntry.embed;
      location.initials = modifiedEntry.initials;
      location.consultationTime1 = modifiedEntry.consultationTime1;
      location.consultationTime2 = modifiedEntry.consultationTime2;
      location.consultationTime3 = modifiedEntry.consultationTime3;
      return location;
    });
    return locations;
  }

  getLocations(zenkitCollections: any): Promise<Location[]> {
    const listShortId = zenkitCollections.locations.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
      const locations = this.transformZenkitEntriesToLocations(zenkitListData);
      return locations;
    });
  }
}
