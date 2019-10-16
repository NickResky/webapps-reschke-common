import { NavigationConfigService } from './navigation-config-service';
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
import { AppNavigationState } from '../constants/app-navigation-state';
import { Router } from '@angular/router';
import { NavigationElement } from '../school-common/classes/navigation-element';
import { AppBreakpoints } from '../constants/app-breakpoints';

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
    loadingAnimationActive = new BehaviorSubject<boolean>(true);
    appWidth = new BehaviorSubject<number>(0);
    appHeight = new BehaviorSubject<number>(0);
    appNavigationState = new BehaviorSubject<AppNavigationState>(AppNavigationState.CENTER);
    activeNavigationElementIndex = new BehaviorSubject<number>(this.getNavigationIndexFromUrl(this.router.url));
    lastTimePageLoaded = Date.now();
    startPageLoadTime = Date.now();
    pageInitiallyLoaded = new BehaviorSubject<boolean>(false);;
    previousRoute = this.router.url;
    previousNavigationElementIndex = this.getNavigationIndexFromUrl(this.router.url);

    // pageLoaded = Observable.create(observer => {
    //     observer.onNext(false);
    //     observer.onCompleted();
    //     return observer;
    // });

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zenkitCollectionsConfig: ZenkitCollectionsService,
        private navigationConfig: NavigationConfigService,
        private mainPageService: MainPageService,
        private stageService: StageService,
        private coursesService: CoursesService,
        private teamService: TeamService,
        private locationsService: LocationsService,
        private contactService: ContactService,
        private currentService: CurrentService,
        private imprintService: ImprintService,
        private scheduleService: ScheduleService,
        private router: Router
    ) { 
        console.log("ModelService created");
        console.log(zenkitCollectionsConfig);
    }

    isPlatformBrowser() {
        // return true;
        return isPlatformBrowser(this.platformId);
    }

    isDeviceMobile() {
        if (this.isPlatformBrowser) {
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            }
        } 
        return false;
    }

    isPageLoaded() {
        return this.pageLoaded;
    }

    isPageInitiallyLoaded() {
        return this.pageInitiallyLoaded;
    }

    updateLoadingStatus(pageLoaded: boolean) {
        if (pageLoaded) {
            this.lastTimePageLoaded = Date.now();
        }
        this.pageLoaded.next(pageLoaded);

        this.loadingAnimationActive.next(!pageLoaded);

        if (pageLoaded) {
            this.pageInitiallyLoaded.next(true);
        }
    }

    setPageLoaded(value: boolean) {
        if (this.pageLoaded.value != value) {

            const timeSinceLastPageLoad = Date.now() - this.lastTimePageLoaded;
            const timeSincePageLoadStart = Date.now() - this.startPageLoadTime;
            const isBrowser = this.isPlatformBrowser();

           if (this.navigationConfig.extendLoadingAnimationDuration && value && (timeSinceLastPageLoad < 50000) && isBrowser) {
                // Extend loading animation to ensure that the spinner is displayed after redirecting 
                setTimeout(() => {
                    this.updateLoadingStatus(value);
                }, 500);
            } else {
                this.updateLoadingStatus(value);
            }


            if (!this.navigationConfig.slideInAnimationActive) {
                this.setAppNavigationState(AppNavigationState.CENTER)
            } else {
                if (this.appNavigationState.value == AppNavigationState.SLIDE_LEFT_FROM_CENTER) {
                    this.setAppNavigationState(AppNavigationState.SLIDE_LEFT_FROM_RIGHT);
                }
                if (this.appNavigationState.value == AppNavigationState.SLIDE_RIGHT_FROM_CENTER) {
                    this.setAppNavigationState(AppNavigationState.SLIDE_RIGHT_FROM_LEFT);
                }
            }
        }
        return value;
    }

    isLoadingAnimationActive() {
        return this.loadingAnimationActive;
    }

    getAppWidth() {
        return this.appWidth;
    }

    setAppWidth(value: number) {
        this.appWidth.next(value);
        return value;
    }

    getAppHeight() {
        return this.appHeight;
    }

    setAppHeight(value: number) {
        this.appHeight.next(value);
        return value;
    }

    getAppNavigationState() {
        return this.appNavigationState;
    }

    setAppNavigationState(state: AppNavigationState) {
        this.appNavigationState.next(state);
        return state;
    }

    getNavigationConfig() {
        return this.navigationConfig;
    }

    getActiveNavigationElementIndex() {
        return this.activeNavigationElementIndex;
    }

    updateNavigation(url: string) {
        // if (!_.isNil(url) && this.previousRoute != url) {
            this.setActiveNavigationElementIndex(url, -1);
            this.updateAnimation(this.activeNavigationElementIndex.value, url);
            this.redirect(url);
        // }
    }

    setActiveNavigationElementIndex(url: string, index: number) {

        // if (this.previousRoute != url) {
            let navigationIndex: number;

            if (index >= 0) {
                navigationIndex = index;
            } else {
                navigationIndex = this.getNavigationIndexFromUrl(url);
            }

            this.previousNavigationElementIndex = navigationIndex;
            this.activeNavigationElementIndex.next(navigationIndex);
            return navigationIndex;
        // }
    }
    
    redirect(url: string) {
        if (url) {
            if (this.isPlatformBrowser && this.navigationConfig.slideOutAnimationActive) {
                setTimeout(()=> {
                    this.previousRoute = url;
                    this.router.navigate([url]);
                }, 700)
            } else {
                this.previousRoute = url;
                this.router.navigate([url]);
            }
        }
    }

    updateAnimation(navigationIndex: number, url: string) {
        
        // only apply slide animations on mobile
        if (this.appWidth.value < AppBreakpoints.MEDIUM && navigationIndex >= 0) {
            if (this.activeNavigationElementIndex.value < navigationIndex) {
                this.setAppNavigationState(AppNavigationState.SLIDE_RIGHT_FROM_CENTER);
            } else {
                this.setAppNavigationState(AppNavigationState.SLIDE_LEFT_FROM_CENTER);
            }
        } else {
            if (this.isPlatformBrowser()) {

                this.setAppNavigationState(AppNavigationState.FADE_OUT);

                setTimeout(() => {
                    this.setAppNavigationState(AppNavigationState.CENTER);
                }, 700);
            }
        }
    }

    getNavigationIndexFromUrl(url: string) {
        if (url === '/' || _.includes(url, 'projekte')) {
            return 0;
        } 

        const navigationIndex = 
            _.findIndex(this.navigationConfig.navigationElements, (element: NavigationElement) => { 
                if (url === '/' || element.routerLink === '/') {
                    return false;
                }
                const containsLink = _.includes(url, element.routerLink);
                return containsLink;
            });
        return navigationIndex;
    }

    navigationSwipeLeft() {
        if (this.activeNavigationElementIndex.value < (this.navigationConfig.navigationElements.length -1)) {
            this.setActiveNavigationElementIndex('', this.activeNavigationElementIndex.value + 1);
            
            const url = this.navigationConfig.navigationElements[this.activeNavigationElementIndex.value].routerLink;
            
            this.updateAnimation(this.activeNavigationElementIndex.value, url);
            this.redirect(url);
        }
    }

    navigationSwipeRight() {
        if (this.activeNavigationElementIndex.value > 0 ) {
            this.setActiveNavigationElementIndex('', this.activeNavigationElementIndex.value - 1);
            
            const url = this.navigationConfig.navigationElements[this.activeNavigationElementIndex.value].routerLink;
            
            this.updateAnimation(this.activeNavigationElementIndex.value, url);
            this.redirect(url);
        }
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
