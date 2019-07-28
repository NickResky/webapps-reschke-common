import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { ApplicationIdentifier } from '../../constants/application-identifier';
import { NavigationConfigService } from '../../services/navigation-config-service';


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
    });
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

}
