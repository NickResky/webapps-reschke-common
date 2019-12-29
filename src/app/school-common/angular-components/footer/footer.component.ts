import { FooterConfigSectionElementTypes } from './../../../constants/footer-config-section-element-types';
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
  showSettings = false;
  isBrowser = false;

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    private footerConfig: FooterConfigService
  ) { }

  ngOnInit() {

    this.isBrowser = this.modelService.isPlatformBrowser();

    if (this.isBrowser) {
      const showSettingsStoredValue = localStorage.getItem('stadlerstadler-show-settings');
      if (showSettingsStoredValue && showSettingsStoredValue == "true") {
        this.showSettings = true;
      }
    }

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
        this.mainPageContentLoaded = x;
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

  isSectionElementOfTypeLink(sectionElement: any) {
    if (sectionElement.type == FooterConfigSectionElementTypes.LINK) {
      return true;
    }
    return false;
  }

  isSectionElementOfTypeText(sectionElement: any) {
    if (sectionElement.type == FooterConfigSectionElementTypes.TEXT) {
      return true;
    }
    return false;
  }

  isSectionElementOfTypeIcon(sectionElement: any) {
    if (sectionElement.type == FooterConfigSectionElementTypes.ICON) {
      return true;
    }
    return false;
  }

  isSectionElementOfTypeSettings(sectionElement: any) {
    if (sectionElement.type == FooterConfigSectionElementTypes.SETTINGS) {
      return true;
    }
    return false;
  }

  activeteShowSettings() {
    if (this.isBrowser) {
      localStorage.setItem('stadlerstadler-show-settings', 'true');
      this.showSettings = true;
      location.reload();
    }
  }

  deactivateShowSettings() {
    if (this.isBrowser) {
      localStorage.removeItem('stadlerstadler-show-settings');
      this.showSettings = false;
      location.reload();
    }
  }
}
