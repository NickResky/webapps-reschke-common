import { ApplicationIdentifier } from '../constants/application-identifier';
import { Observable } from 'rxjs/Observable';
import { CurrentService } from './current.service';
import { ContactService } from './contact.service';
import { LocationsService } from './locations.service';
import { TeamService } from './team.service';
import { CoursesService } from './courses.service';
import { StageService } from './stage.service';
import { MainPageService } from './main-page.service';
import { ScheduleService } from './schedule.service';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import * as _ from 'lodash';
import { ImprintService } from './imprint.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { InjectionToken } from '@angular/core';
import { 
    Appointment,
    BlogPost,
    Contact,
    CourseData,
    CourseInformation,
    Imprint,
    LocationData,
    Location,
    MainPageData,
    ScheduleData,
    Teacher,
    Performance 
} from '../../../classes';
import { ZenkitCollectionsService } from './zenkit-collections.service';
import { ZenkitCollectionsConfig } from '../constants/zenkit-collections-config';
import { UtilityService } from './utility.service';

@Injectable({
    providedIn: 'root'
})
export class ModelService {

    mainPageData: Promise<MainPageData>|undefined;
    contactData: Promise<Contact>;
    blogPostsData: Promise<BlogPost[]>|undefined;
    coursesData: Promise<CourseData>|undefined;
    performancesData: Promise<Performance[]>|undefined;
    teamData: Promise<Teacher[]>|undefined;
    locationData: Promise<LocationData>|undefined;
    locations: Promise<Location[]>|undefined;
    imprintData: Promise<string>;
    privacyData: Promise<string>;
    scheduleData: Promise<ScheduleData>|undefined;
    pageLoaded = new BehaviorSubject<boolean>(false);
    appWidth = new BehaviorSubject<number>(0);

    // pageLoaded = Observable.create(observer => {
    //     observer.onNext(false);
    //     observer.onCompleted();
    //     return observer;
    // });

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zenkitCollectionsConfig: ZenkitCollectionsService,
        private mainPageService: MainPageService,
        private stageService: StageService,
        private coursesService: CoursesService,
        private teamService: TeamService,
        private locationsService: LocationsService,
        private contactService: ContactService,
        private currentService: CurrentService,
        private imprintService: ImprintService,
        private scheduleService: ScheduleService
    ) { 
        console.log("ModelService created");
        console.log(zenkitCollectionsConfig);
    }

    isPlatformBrowser() {
        // return true;
        return isPlatformBrowser(this.platformId);
    }

    isPageLoaded() {
        return this.pageLoaded;
    }

    setPageLoaded(value: boolean) {
        this.pageLoaded.next(value);
        return value;
    }

    getAppWidth() {
        return this.appWidth;
    }

    setAppWidth(value: number) {
        this.appWidth.next(value);
        return value;
    }

    getMainPageSections(): Promise<MainPageData> {
        if (_.isNil(this.mainPageData)) {
            this.mainPageData = this.mainPageService.getMainPageSections(this.zenkitCollectionsConfig);
            return this.mainPageData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.mainPageData);
        });
    }

    getPosts(): Promise<BlogPost[]> {
        if (_.isNil(this.blogPostsData)) {
            this.blogPostsData = this.currentService.getPosts(this.zenkitCollectionsConfig);
        }
        return new Promise((resolve, reject) => {
            return resolve(this.blogPostsData);
        });
    }

    getPostByShortId(shortId: string): Promise<BlogPost> {
        return this.getPosts().then((posts: any) => {
            const post = _.find(posts, (p: any) => {
                return p.shortId === shortId;
            });
            return post;
        });
    }

    getPerformances(): Promise<Performance[]> {
        if (_.isNil(this.performancesData)) {
            this.performancesData = this.stageService.getPerformances(this.zenkitCollectionsConfig);
            return this.performancesData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.performancesData);
        });
    }

    getPerformanceByShortId(shortId: string): Promise<Performance> {
        return this.getPerformances().then((performances: any) => {
            const performance = _.find(performances, (p: any) => {
                return p.shortId === shortId;
            });
            return performance;
        });
    }

    getCourses(): Promise<CourseData> {
        if (_.isNil(this.coursesData)) {
            this.coursesData = this.coursesService.getCourses(this.zenkitCollectionsConfig);
            return this.coursesData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.coursesData);
        });
    }

    getScheduleData() {
        if (_.isNil(this.scheduleData)) {
            return Promise.all([this.getCourses(), this.getTeam(), this.getLocations()]).then((result: any) => {
                const courses: CourseInformation[] = _.get(result[0], ['courses']);
                const teachers: Teacher[] = result[1];
                const locations: Location[] = result[2];
                this.scheduleData = this.scheduleService.getScheduleData(this.zenkitCollectionsConfig, courses, teachers, locations);
                return this.scheduleData;
            });
        }
        return new Promise((resolve, reject) => {
            return resolve(this.scheduleData);
        });
    }

    getTeam(): Promise<Teacher[]> {
        if (_.isNil(this.teamData)) {
            this.teamData = this.teamService.getTeam(this.zenkitCollectionsConfig);
            return this.teamData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.teamData);
        });
    }

    getTeacherByUrlName(urlName: string) {
        return this.getTeam().then((team) => {
            const teacher = _.find(team, (t: Teacher) => {
                const teacherUrlName = UtilityService.convertTeacherToUrlName(t);
                return teacherUrlName === urlName;
            });
            return teacher;
        });
    }

    getTeacherByShortId(shortId: string) {
        return this.getTeam().then((teachers: Teacher[]) => {
            const teacher = _.find(teachers, (t: Teacher) => {
                return t.shortId === shortId;
            });
            return teacher;
        });
    }

    convertTeacherToUrlId(teacher: Teacher) {
        return UtilityService.convertTeacherToUrlName(teacher);
    }

    getLocations(): Promise<Location[]> {
        if (_.isNil(this.locations)) {
            this.locations = this.locationsService.getLocations(this.zenkitCollectionsConfig);
            return this.locations;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.locations);
        });
    }

    getLocationData(): Promise<LocationData> {
        if (_.isNil(this.locationData)) {
            this.locationData = this.locationsService.getLocationData(this.zenkitCollectionsConfig);
            return this.locationData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.locationData);
        });
    }

    getLocationByInitials(initials: string) {
        return this.getLocations().then((locations: Location[]) => {
            const location = _.find(locations, (l: Location) => {
                return l.initials === initials;
            });
            return location;
        });
    }

    getLocationByShortId(shortId: string) {
        return this.getLocations().then((locations: Location[]) => {
            const location = _.find(locations, (l: Location) => {
                return l.shortId === shortId;
            });
            return location;
        });
    }

    getContact(): Promise<Contact> {
        if (_.isNil(this.contactData)) {
            this.contactData = this.contactService.getContact(this.zenkitCollectionsConfig);
            return this.contactData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.contactData);
        });
    }

    getImprintData() {
        if (_.isNil(this.imprintData)) {
            this.imprintData = this.getContact().then((contact: Contact) => {
                return contact.imprint;
            });
            return this.imprintData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.imprintData);
        });
    }

    getPrivacyData() {
        if (_.isNil(this.privacyData)) {
            this.privacyData = this.getContact().then((contact: Contact) => {
                return contact.privacy;
            });
            return this.privacyData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.privacyData);
        });
    }

    getScssVariables() {
        if (this.zenkitCollectionsConfig.applicationIdentifier === ApplicationIdentifier.TTH) {
            
        }
    }
}
