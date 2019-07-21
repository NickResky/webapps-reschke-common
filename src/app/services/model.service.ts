import { ZenkitCollectionsTTH } from './../constants/zenkit-collections';
import { Observable } from 'rxjs/Observable';
import { CurrentService } from './current.service';
import { ContactService } from './contact.service';
import { LocationsService } from './locations.service';
import { TeamService } from './team.service';
import { CoursesService } from './courses.service';
import { StageService } from './stage.service';
import { MainPageService } from './main-page.service';
import { ScheduleService } from './schedule.service';
import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import { ImprintService } from './imprint.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Appointment, BlogPost, Contact, CourseData, CourseInformation, Imprint, LocationData, MainPageData, ScheduleData, Teacher, Performance } from '../../../classes';

@Injectable()
export class ModelService {

    mainPageData: Promise<MainPageData>|undefined;
    contactData: Promise<Contact>|undefined;
    blogPostsData: Promise<BlogPost[]>|undefined;
    coursesData: Promise<CourseData>|undefined;
    performancesData: Promise<Performance[]>|undefined;
    teamData: Promise<Teacher[]>|undefined;
    locationData: Promise<LocationData>|undefined;
    imprintData: Promise<Imprint[]>|undefined;
    scheduleData: Promise<ScheduleData>|undefined;
    pageLoaded = new BehaviorSubject<boolean>(false);
    zenkitCollection: any = ZenkitCollectionsTTH;

    // pageLoaded = Observable.create(observer => {
    //     observer.onNext(false);
    //     observer.onCompleted();
    //     return observer;
    // });

    constructor(
        private mainPageService: MainPageService,
        private stageService: StageService,
        private coursesService: CoursesService,
        private teamService: TeamService,
        private locationsService: LocationsService,
        private contactService: ContactService,
        private currentService: CurrentService,
        private imprintService: ImprintService,
        private scheduleService: ScheduleService
    ) { }

    setZenkitCollection(collection: any) {
        this.zenkitCollection = collection;
    }

    getZenkitCollection() {
        return this.zenkitCollection;
    }

    isPlatformBrowser() {
        return true;
        //return isPlatformBrowser(this.platformId);
    }

    isPageLoaded() {
        return this.pageLoaded;
    }

    setPageLoaded(value: boolean) {
        this.pageLoaded.next(value);
        return value;
    }

    getMainPageSections(): Promise<MainPageData>|undefined {
        if (_.isNil(this.mainPageData)) {
            this.mainPageData = this.mainPageService.getMainPageSections(this.zenkitCollection);
            return this.mainPageData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.mainPageData);
        });
    }

    getPosts(): Promise<BlogPost[]> {
        if (_.isNil(this.blogPostsData)) {
            this.blogPostsData = this.currentService.getPosts(this.zenkitCollection);
        }
        return this.blogPostsData;
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
            this.performancesData = this.stageService.getPerformances(this.zenkitCollection);
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
            this.coursesData = this.coursesService.getCourses(this.zenkitCollection);
            return this.coursesData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.coursesData);
        });
    }

    getScheduleData() {
        if (_.isNil(this.scheduleData)) {
            return Promise.all([this.getCourses(), this.getTeam(), this.getLocationData()]).then((result: any) => {
                const courses: CourseInformation[] = _.get(result[0], ['courses']);
                const teachers: Teacher[] = result[1];
                const locationData: LocationData = result[2];
                this.scheduleData = this.scheduleService.getScheduleData(this.zenkitCollection, courses, teachers, locationData);
                return this.scheduleData;
            });
        }
        return new Promise((resolve, reject) => {
            return resolve(this.scheduleData);
        });
    }

    getTeam(): Promise<Teacher[]> {
        if (_.isNil(this.teamData)) {
            this.teamData = this.teamService.getTeam(this.zenkitCollection);
            return this.teamData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.teamData);
        });
    }

    getTeacherByUrlId(urlId: string) {
        return this.getTeam().then((team) => {
            const teacher = _.find(team, (t: Teacher) => {
                const teacherUrlId = this.teamService.convertTeacherToUrlId(t);
                return teacherUrlId === urlId;
            });
            return teacher;
        });
    }

    getLocationData(): Promise<LocationData> {
        if (_.isNil(this.locationData)) {
            this.locationData = this.locationsService.getLocationData(this.zenkitCollection);
            return this.locationData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.locationData);
        });
    }

    getLocationByInitials(initials: string) {
        return this.getLocationData().then((locationData: LocationData) => {
            if (initials === 'MG') {
                return locationData.locationMG;
            } else if (initials === 'LB') {
                return locationData.locationLB;
            }
            return undefined;
        });
    }

    getContact() {
        if (_.isNil(this.contactData)) {
            this.contactData = this.contactService.getContact(this.zenkitCollection);
            return this.contactData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.contactData);
        });
    }

    getEntries() {
        if (_.isNil(this.imprintData)) {
            this.imprintData = this.imprintService.getEntries(this.zenkitCollection);
            return this.imprintData;
        }
        return new Promise((resolve, reject) => {
            return resolve(this.imprintData);
        });
    }
}
