import { NavigationElement } from './../../school-common/classes/navigation-element';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
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
  selector: 'wrc-leon-sans-animation',
  templateUrl: 'leon-sans-animation.component.html',
  styleUrls: []
})
export class LeonSansAnimationComponent implements OnInit {

  pageLoaded = false;
  pageInitiallyLoaded = false;
  isBrowser = false;
  appHeight: number = 0;
  appWidth: number = 0;
  isSmallDevice = true;

  @ViewChild('canvaselement') canvasElement: ElementRef;
  @Input() textparam: any;

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

    this.modelService.getAppHeight().subscribe(
      (x) => {
        this.appHeight = x;
        if (this.appWidth > 0) {
          this.createLeonSans();
        }
      }
    );

    this.modelService.getAppWidth().subscribe((width) => {
      if (width <= 0) {
        return width;
      }
      this.appWidth = width;
      if (width <= AppBreakpoints.MEDIUM) {
        this.isSmallDevice = true;
      } else {
        this.isSmallDevice = false;
      }
      if (this.appHeight > 0) {
        this.createLeonSans();
      }
    })
      
  }

  createLeonSans() {
    this.canvas = this.canvasElement.nativeElement;
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.appWidth * this.pixelRatio;
    this.canvas.height = this.appHeight * this.pixelRatio;
    this.canvas.style.width = this.appWidth + 'px';
    this.canvas.style.height = this.appHeight + 'px';
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.leon = new LeonSans({
        text: _.upperCase(this.textparam),
        color: ['#222222'],
        size: 300,
        weight: 400,
        align: 'center'
    });

    requestAnimationFrame(this.animate.bind(this));

    let i, total = this.leon.drawing.length;
    
    for (i = 0; i < total; i++) {
      TweenMax.fromTo(this.leon.drawing[i], 3, {
          value: 0
        }, {
          delay: i * 0.05,
          value: 1,
          ease: Power4.easeOut
      });
    }  
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.sw, this.sh);

    const x = (this.appWidth - this.leon.rect.w) / 2;
    const y = (this.appHeight - this.leon.rect.h) / 2;
    this.leon.position(x, y);

    this.leon.draw(this.ctx);
    // this.leon.point(this.ctx);
    // this.leon.box(this.ctx);
    // this.leon.grid(this.ctx);

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
