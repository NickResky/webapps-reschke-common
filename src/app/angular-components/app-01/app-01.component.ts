import { NavigationConfigService } from './../../services/navigation-config-service';
import { AppNavigationState } from './../../constants/app-navigation-state';

import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { SeoService } from '../../services/seo.service';
import * as Hammer from 'hammerjs';
import * as propagating from 'propagating-hammerjs';

@Component({
  selector: 'wrc-root',
  templateUrl: './app-01.component.html',
  styleUrls: ['./app-01.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class App01Component implements OnInit {
  title = 'app';
  pageLoaded = true;
  removeOverlay = false;
  isBrowser = false;
  isDeviceMobile = false;
  appNavigationState: AppNavigationState = AppNavigationState.CENTER;

  @ViewChild('appcontainer') appContainerElement: ElementRef;

  constructor(
    private router: Router,
    private modelService: ModelService,
    private seoService: SeoService,
    public navigationConfig: NavigationConfigService
  ) {
      this.seoService.addSeoData();
  }

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    console.log("App width: " + event.target.innerWidth);
    this.modelService.setAppWidth(event.target.innerWidth);
    console.log("App height: " + event.target.innerHeight);
    this.modelService.setAppHeight(event.target.innerHeight);
  }

  ngOnInit() {

    this.isBrowser = this.modelService.isPlatformBrowser();
    if (this.isBrowser) {
      console.log("Platform is browser");
      this.pageLoaded = false;
      this.removeOverlay = false;
    } else {
      console.log("Platform is server");
      this.pageLoaded = true;
      this.removeOverlay = true;
    }
    this.isDeviceMobile = this.modelService.isDeviceMobile();
    if (this.isDeviceMobile) {
      console.log("Device is mobile");
    } else {
      console.log("Device is not mobile");
    }
  }

  ngAfterViewInit() {

    const appContainerWidth = this.appContainerElement.nativeElement.clientWidth;
    const appContainerHeight = this.appContainerElement.nativeElement.clientHeight;
    console.log("App width: " + appContainerWidth);
    this.modelService.setAppWidth(appContainerWidth);
    console.log("App height: " + appContainerHeight);
    this.modelService.setAppHeight(appContainerHeight);

    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        if (this.modelService.isPlatformBrowser()) {
          window.scrollTo(0, 0);
        }
    });

    this.modelService.isPageLoaded().subscribe(
        (x) => {
          if (this.modelService.isPlatformBrowser()) {
            this.pageLoaded = x;
            this.removeOverlay = x;
          }
        }
    );

    this.modelService.getAppNavigationState().subscribe(
      (state: AppNavigationState) => {
        console.log("App navigation state changed to " + state);
        this.appNavigationState = state;
      }
    );
    const hammer1 = propagating(new Hammer(this.appContainerElement.nativeElement));
    hammer1
      .on("swipeleft", (ev: any)=> {
        if (this.navigationConfig.slideActive) {
          this.onSwipeLeft();
        }
      })
      .on("swiperight", (ev: any)=> {
        if (this.navigationConfig.slideActive) {
          this.onSwipeRight();
        }
      });

  }

  onSwipeLeft() {
    this.modelService.navigationSwipeLeft();
    console.log("swipe left detected");
  }

  onSwipeRight() {
    this.modelService.navigationSwipeRight();
    console.log("swipe right detected");
  }
}
