import { FooterLink } from './../../classes/footer-link';
import { FooterConfigService } from './../../../services/footer-config-service';
import { ApplicationIdentifier } from './../../../constants/application-identifier';
import { ZenkitCollectionsService } from './../../../services/zenkit-collections.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Contact } from '../../classes/contact';
import { Location } from '../../classes/location';
import { ModelService } from '../../../services/model.service';

@Component({
  selector: 'wrc-footer-01',
  templateUrl: 'footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class Footer01Component implements OnInit {

  locations: Location[]|undefined;
  mainLocation: Location|undefined;
  footerContentLoaded = false;
  mainPageContentLoaded = false;
  contact: Contact|undefined;
  pageLoaded = false;

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    private footerConfig: FooterConfigService
  ) { }

  ngOnInit() {
    this.modelService.isPageLoaded().subscribe(
      (x: any) => {
        this.mainPageContentLoaded = x;
      });

    Promise.all([
      this.modelService.getContact(),
      this.modelService.getLocations()
    ]).then((results: any) => {
      this.contact = results[0];
      this.locations = results[1];
      if (this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.YW) {
        this.mainLocation = _.find(this.locations, {
          initials: 'YW'
        });
      }
      this.footerContentLoaded = true;
    });

    this.modelService.isPageLoaded().subscribe(
      (x) => {
        if (this.modelService.isPlatformBrowser()) {
          this.pageLoaded = x;
        }
      }
  );
  }

  getSocialLink(link: FooterLink) {
    if (link.isEmail) {
      // return 'mailto:' + link.link 
    }
    return link.link;
  }

  isApplicationYW() {
    return this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.YW;
  }

  isApplicationTTH() {
    return this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.TTH;
  }

  isApplicationSS() {
    return this.zenkitCollectionsConfig.applicationIdentifier == ApplicationIdentifier.SS;
  }

}
