import { ApplicationIdentifier } from './../../../constants/application-identifier';
import { ZenkitCollectionsService } from './../../../services/zenkit-collections.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Contact } from '../../classes/contact';
import { Location } from '../../classes/location';
import { ModelService } from '../../../services/model.service';

@Component({
  selector: 'app-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  locations: Location[]|undefined;
  mainLocation: Location|undefined;
  footerContentLoaded = false;
  mainPageContentLoaded = false;
  contact: Contact|undefined;

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService
  ) { }

  ngOnInit() {
    this.modelService.isPageLoaded().subscribe(
      (x: any) => {
        this.mainPageContentLoaded = x;
      });

    Promise.all([this.modelService.getContact(), this.modelService.getLocations()]).then((results: any) => {
      this.contact = results[0];
      this.locations = results[1];
      if (this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.YW){
        this.mainLocation = _.find(this.locations, {
          initials: 'YW'
        });
      }
      this.footerContentLoaded = true;
    });
  }

  isApplicationYW() {
    return this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.YW;
  }

  isApplicationTTH() {
    return this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.TTH;
  }

}
