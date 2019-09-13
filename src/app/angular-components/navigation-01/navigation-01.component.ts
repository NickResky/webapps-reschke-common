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
import { TweenMax, Power4} from '../../resources/TweenMax.min';


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
  appWidth: number = 0;
  borderWidth: number = 0;
  activeNavigationElementIndex = 0;
  isSmallDevice = true;
  previousUrl = '';

  @ViewChild('navbarsecondrowborderelement') navbarSecondRowBorderElement: ElementRef;
  @ViewChild('canvaselement') canvasElement: ElementRef;

  sw = 800;
  sh = 300;
  pixelRatio = 2;

  canvas: any;
  ctx: any;
  leon: any;

  
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

    this.modelService.getAppWidth().subscribe(
      (x) => {
        this.appWidth = x;
      }
    );

    this.modelService.getActiveNavigationElementIndex().subscribe(
      (index) => {
        this.activeNavigationElementIndex = index;
        console.log('Navigation index: ' + index);
      }
    )

    this.modelService.getAppWidth().subscribe((width) => {
      if (width <= AppBreakpoints.MEDIUM) {
        this.isSmallDevice = true;
      } else {
        this.isSmallDevice = false;
      }
      this.canvas = this.canvasElement.nativeElement;
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = width * this.pixelRatio;
      this.canvas.height = this.sh * this.pixelRatio;
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = this.sh + 'px';
      this.ctx.scale(this.pixelRatio, this.pixelRatio);

      this.leon = new LeonSans({
          text: 'STADLERSTADLER',
          color: ['#222222'],
          size: 100,
          weight: 400,
          align: 'center'
      });

      requestAnimationFrame(this.animate.bind(this));

      let i, total = this.leon.drawing.length;
      // for (i = 0; i < total; i++) {
      //   TweenMax.fromTo(this.leon.drawing[i], 1.6, {
      //       value: 0
      //     }, {
      //       delay: i * 0.05,
      //       value: 1,
      //       ease: Power4.easeOut
      //   });
      // }
    })

    this.router.events.subscribe((evt: any) => {
      this.pageIsHome = evt.url === '/';
      this.modelService.updateNavigation(evt.url);
    });



    
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.sw, this.sh);

    const x = (this.sw - this.leon.rect.w) / 2;
    const y = (this.sh - this.leon.rect.h) / 2;
    this.leon.position(x, y);

    this.leon.draw(this.ctx);
    this.leon.point(this.ctx);
    // this.leon.box(this.ctx);
    // this.leon.grid(this.ctx);

  }
  

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    this.borderWidth = this.navbarSecondRowBorderElement.nativeElement.clientWidth / this.navigationConfig.navigationElements.length;
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

  getLoaderContainerStyle() {
    if (this.isSmallDevice) {
      return {
        height: this.appHeight + 'px'
      }
    } else {
      return {
        height : '500px'
      }
    }
  }

}
