import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { ApplicationIdentifier } from '../../constants/application-identifier';
import { NavigationConfigService } from '../../services/navigation-config-service';
import _ = require('lodash');
import { AppNavigationState } from '../../constants/app-navigation-state';


@Component({
  selector: 'wrc-navigation-01',
  templateUrl: 'navigation-01.component.html',
  styleUrls: []
})
export class Navigation01Component implements OnInit {

  isMobileNavOpen = false;
  pageLoaded = false;
  pageInitiallyLoaded = false;
  showLoadingAnimationAfterInitialLoad = false;
  pageIsHome = false;
  isBrowser = false;
  
  constructor(
    private modelService: ModelService,
    private router: Router,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    public navigationConfig: NavigationConfigService
  ) { }

  ngOnInit() {

    this.isBrowser = this.modelService.isPlatformBrowser();
    if (this.isBrowser) {
      this.pageLoaded = false;
      this.pageInitiallyLoaded = false;
      this.showLoadingAnimationAfterInitialLoad = this.navigationConfig.showLoadingAnimationAfterInitialLoad;
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

    this.router.events.subscribe((evt: any) => {
      this.pageIsHome = evt.url === '/';

      // reset
      this.navigationConfig.navigationElements = _.map(this.navigationConfig.navigationElements, (el) => {
        return { ...el, isActive: el.routerLink === evt.url }
      });


    });
  }

  redirectTo(path: string) {
    // const currentNavigationIndex = _.findIndex(this.navigationConfig.navigationElements, {
    //   isActive: true
    // });
    const targetNavigationIndex = _.findIndex(this.navigationConfig.navigationElements, {
      routerLink: path
    });

    this.modelService.setActiveNavigationElementIndex(targetNavigationIndex);

    // if (this.isBrowser) {
    //   setTimeout(()=> {
    //     this.router.navigate([path]);
    //   }, 500)
    // } else {
    //   this.router.navigate([path]);
    // }
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
