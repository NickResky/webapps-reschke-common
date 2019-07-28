import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CourseData, CourseInformation } from '../../../classes';
import { UtilityService } from './utility.service';
import { ZenkitDataService } from './zenkit-data-service';

@Injectable()
export class CoursesService {

    constructor() { }

  getCourses(zenkitCollections: any) {
    const listShortId = zenkitCollections.courses.shortId;
    return ZenkitDataService.getZenkitListData({
        listShortId: listShortId,
        requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
      }).then((zenkitListData: any) => {
            const pricesEntry: any = _.find(zenkitListData.entries, {
                label: 'Preise'
            });
            const scheduleMGEntry: any = _.find(zenkitListData.entries, {
                label: 'Stundenplan Markgroeningen'
            });
            const scheduleLBEntry: any = _.find(zenkitListData.entries, {
                label: 'Stundenplan Ludwigsburg'
            });
            const registrationChildEntry: any = _.find(zenkitListData.entries, {
                label: 'Anmeldung Kind'
            });
            const registrationAdultEntry: any = _.find(zenkitListData.entries, {
                label: 'Anmeldung Erwachsener'
            });

            const courseEntries: any = _.filter(zenkitListData.entries, {
                label: 'Kurs'
            });

            const courseData = new CourseData();
            courseData.text = pricesEntry.description;
            if (scheduleMGEntry) {
                courseData.scheduleMG = _.head(scheduleMGEntry.file);
            }
            if (scheduleLBEntry) {
                courseData.scheduleLB = _.head(scheduleLBEntry.file);
            }
            if (registrationChildEntry) {
                courseData.registrationChild = _.head(registrationChildEntry.file);
            }

            if (registrationAdultEntry) {
                courseData.registrationAdult = _.head(registrationAdultEntry.file);
            }

            courseData.courses = _.map(courseEntries, (courseEntry) => {
                const course = new CourseInformation();
                course.uuid = courseEntry.uuid;
                course.shortId = courseEntry.shortId;
                course.title = courseEntry.title;
                course.description = courseEntry.description;
                course.image = _.head(courseEntry.image);
                course.youtubeId = courseEntry.youtubeId;
                return course;
            });

            return courseData;
      });
  }

}
