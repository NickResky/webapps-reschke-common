import { MainPageSectionTypes } from './../constants/main-page-section-types';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CourseInformation, MainPageData, MainPageSection } from '../../../classes';
import { ZenkitDataService } from './zenkit-data-service';
import { UtilityService } from './utility.service';

@Injectable()
export class MainPageService {

  constructor() { }

  getMainPageSections(zenkitCollections: any) {

    const listShortId = zenkitCollections.home.shortId;
    return ZenkitDataService.getZenkitListData({
      listShortId: listShortId,
      requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
    }).then((zenkitListData) => {
        const mainPageSections = _.map(zenkitListData.entries, (modifiedEntry) => {
          const mainPageSection = new MainPageSection();
          mainPageSection.title = modifiedEntry.title;
          mainPageSection.description = modifiedEntry.description;
          mainPageSection.image = _.head(modifiedEntry.image);
          mainPageSection.youtubeVideoId = modifiedEntry.youtubeVideoId;

          const sectionType = _.find(MainPageSectionTypes, {
            name: modifiedEntry.title
          });
          mainPageSection.cssClass = _.get(sectionType, ['cssClass']);
          mainPageSection.routerLink =  _.get(sectionType, ['routerLink']);
          return mainPageSection;
        });

        const getSection = function(sectionName: string) {
          const section = _.head(_.remove(mainPageSections, {
            title: sectionName
          }));

          if (_.isNil(section)) {
            console.log('Section "' + sectionName + '" was not found');
          }

          return section;
        };

        const videoSection = getSection('Video');

        const philosophySection = getSection('das Tanztheater');

        const blogSection = getSection('Neuigkeiten');

        const coursesSection = getSection('Kurse');

        const performancesSection = getSection('Auftritte');

        const teamSection = getSection('Team');

        const locationsSection = getSection('Standorte');

        const contactSection = getSection('Kontakt');

        const videoFileSection = getSection('Videodatei');

        const titleImageSection = getSection('Titelbild');

        const mainPageData = new MainPageData();
        mainPageData.youtubeVideoId = _.get(videoSection, ['youtubeVideoId']);
        mainPageData.philosophySection = philosophySection;
        mainPageData.blogSection = blogSection;
        mainPageData.coursesSection = coursesSection;
        mainPageData.performancesSection = performancesSection;
        mainPageData.teamSection = teamSection;
        mainPageData.locationsSection = locationsSection;
        mainPageData.contactSection = contactSection;
        mainPageData.videoFileSection = videoFileSection;
        mainPageData.titleImageSection = titleImageSection;

        return mainPageData;
      });
    }

}
