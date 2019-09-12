import { NavigationElement } from './../../school-common/classes/navigation-element';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { ApplicationIdentifier } from '../../constants/application-identifier';
import { NavigationConfigService } from '../../services/navigation-config-service';
import _ = require('lodash');
import { AppNavigationState } from '../../constants/app-navigation-state';
import { EventListener } from '@angular/core/src/debug/debug_node';
import { AppBreakpoints } from '../../constants/app-breakpointss';


@Component({
  selector: 'wrc-navigation-01',
  templateUrl: 'navigation-01.component.html',
  styleUrls: []
})
export class Navigation01Component implements OnInit {

  isMobileNavOpen = false;
  pageLoaded = false;
  pageInitiallyLoaded = false;
  pageIsHome = false;
  isBrowser = false;
  appHeight: number = 0;
  borderWidth: number = 0;
  activeNavigationElementIndex = 0;
  isSmallDevice = true;
  previousUrl = '';

  @ViewChild('navbarsecondrowborderelement') navbarSecondRowBorderElement: ElementRef;
  
  constructor(
    private modelService: ModelService,
    private router: Router,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    public navigationConfig: NavigationConfigService
  ) { }

  ngOnInit() {

    this.borderWidth = this.navbarSecondRowBorderElement.nativeElement.clientWidth / this.navigationConfig.navigationElements.length;

    this.isBrowser = this.modelService.isPlatformBrowser();
    if (this.isBrowser) {
      this.pageLoaded = false;
      this.pageInitiallyLoaded = false;
    } else {
      this.pageLoaded = true;
      this.pageInitiallyLoaded = true;
    }

    this.modelService.isPageLoaded().subscribe(
      (x) => {
        if (this.modelService.isPlatformBrowser()) {
          this.pageLoaded = x;
          if (x && !this.pageInitiallyLoaded) {
            this.pageInitiallyLoaded = true;
          }
        }
      }
    );

    this.modelService.getAppHeight().subscribe(
      (x) => {
        this.appHeight = x;
      }
    );

    this.modelService.getActiveNavigationElementIndex().subscribe(
      (index) => {
        this.activeNavigationElementIndex = index;
        console.log('Navigation index: ' + index);
      }
    )

    this.modelService.getAppWidth().subscribe(
      (width) => {
        if (width <= AppBreakpoints.MEDIUM) {
          this.isSmallDevice = true;
        } else {
          this.isSmallDevice = false;
        }
      }
    )

    this.router.events.subscribe((evt: any) => {
      this.pageIsHome = evt.url === '/';

      // reset
      // this.navigationConfig.navigationElements = _.map(this.navigationConfig.navigationElements, (el) => {
      //   return { ...el, isActive: _.includes(evt.url, el.routerLink)}
      // });

      if (!_.isNil(evt.url) && this.previousUrl != evt.url) {
        if (this.pageIsHome || _.includes(evt.url, 'projekte')) {
          this.modelService.setActiveNavigationElementIndex(0);
        } else {
          const index = _.findIndex(this.navigationConfig.navigationElements, (element: NavigationElement) => {
            if (evt.url === '/' || element.routerLink === '/') {
              return false;
            }
            const containsLink = _.includes(evt.url, element.routerLink);
            return containsLink;
          });
          this.modelService.setActiveNavigationElementIndex(index);
        }
      }
      this.previousUrl = evt.url;
    });
  }

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    this.borderWidth = this.navbarSecondRowBorderElement.nativeElement.clientWidth / this.navigationConfig.navigationElements.length;
  }

  redirectTo(path: string) {
    // const currentNavigationIndex = _.findIndex(this.navigationConfig.navigationElements, {
    //   isActive: true
    // });
    const targetNavigationIndex = _.findIndex(this.navigationConfig.navigationElements, {
      routerLink: path
    });

    this.modelService.setActiveNavigationElementIndex(targetNavigationIndex);
  }

  toggleMobileNav() {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  closeMobileNav() {
    this.isMobileNavOpen = false;
  }

  getRouterLink(element: any) {
    return element.routerLink;
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
