import { AppBreakpoints } from './../../constants/app-breakpoints';
import { NavigationConfigService } from './../../services/navigation-config-service';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioConfigService } from './../../services/portfolio-config-service';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { ModelService } from './../../services/model.service';
import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { BlogPost } from '../../../../classes';
import { UtilityService } from '../../../../services';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'wrc-image-gallery-02',
  templateUrl: './image-gallery-02.component.html',
  styleUrls: []
})
export class ImageGallery02Component implements OnInit {

  @Input() images: any;
  allImagesLoaded = true;
  allImagesLoadedTimeout = 4000;
  allImagesLoadedTimeoutPassed = false;
  isBrowser = this.modelService.isPlatformBrowser();
  pageLoaded = false;
  pageInitiallyLoaded = false;
  displayLargeImages = true;
  galleryContainerWidth = 0;
  imageWidth = 0;
  imageHeight = 0;
  appWidth = 0;
  onlyShowTitleImages = true;


  @ViewChild('galleryContainerElement') galleryContainerElement: ElementRef;

  viewTypes = [
    {
      name: "large",
      title: "Liste",
      class: "fas fa-th-large",
      active: true
    },
    {
      name: "small",
      title: "Kacheln",
      class: "fas fa-th",
      active: false
    }
  ]

  filterOptions = [
    {
      name: "all-images",
      title: "Alle Bilder",
      active: false
    },
    {
      name: "only-title-images",
      title: "Titelbilder",
      active: true
    }
  ]

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    public portfolioConfig: PortfolioConfigService,
    private navigationConfig: NavigationConfigService
  ) {

  }

  ngOnInit() {
    this.modelService.setPageLoaded(true);

    if (this.isBrowser) {
      setTimeout(() => {
        this.allImagesLoadedTimeoutPassed = true;
      }, this.allImagesLoadedTimeout)
    }

    this.modelService.isLoadingAnimationActive().subscribe(
      (x) => {
        if (this.modelService.isPlatformBrowser()) {
          if (!x && !this.pageInitiallyLoaded && this.isBrowser) {
            // When the page is loaded for the first time the gallery is supposed to fade in after the navigation
            setTimeout(() => {
              this.pageLoaded = !x;
            }, this.navigationConfig.fadeInAnimationDurationInMs);
          } else {
            this.pageLoaded = !x;
          }
        }
      }
    );

    this.modelService.isPageInitiallyLoaded().subscribe(
      (x) => {
        this.pageInitiallyLoaded = x
      }
    );

    this.modelService.getAppWidth().subscribe(
      (x) => {
        this.appWidth = x;
    });
  }

  ngAfterViewInit() {
    this.galleryContainerWidth = this.galleryContainerElement.nativeElement.clientWidth;

    this.updateGallery();
  }

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    this.galleryContainerWidth = this.galleryContainerElement.nativeElement.clientWidth;
    console.log("gallery width: " + this.galleryContainerWidth);
    this.updateGallery();
  }

  updateGallery() {
    if (this.displayLargeImages) {
      this.imageWidth = this.galleryContainerWidth;
    } else {
      this.imageWidth = this.galleryContainerWidth / 2;
    }

    if (this.appWidth > AppBreakpoints.MEDIUM) {
      if (this.displayLargeImages) {
        this.imageWidth = this.galleryContainerWidth / 2;
      } else {
        this.imageWidth = this.galleryContainerWidth / 3;
      }
    }
    if (
      this.appWidth > AppBreakpoints.LARGE
      && !this.displayLargeImages) {
        this.imageWidth = this.galleryContainerWidth / 4;
    }

    this.imageHeight = (this.imageWidth / 16) * 9;
  }

  getDateStringLong(date: Date) {
    return UtilityService.convertDateToStringLong(date);
  }

  imageLoaded(image: any) {
    const currentImage: any = _.find(this.images, {
      shortId: image.shortId
    });
    currentImage.imageLoaded = true;

    const foundUnloadedImage = _.find(this.images, (img: any)=> {
      return img.imageLoaded != true
    });
    if (_.isNil(foundUnloadedImage)) {
      this.modelService.setPageLoaded(true);
      this.allImagesLoaded = true;
    }
  }

  redirect(url: string) {
    this.modelService.updateNavigation('projekte/' + url);
  }

  changeViewType(viewType: any) {
    const type = _.find(this.viewTypes, {
      name: viewType.name
    })
    this.viewTypes.forEach(type => {
      type.active = false;
    });
    viewType.active = true;
    this.displayLargeImages = viewType.name === 'large';
    this.updateGallery();
  }

  changeFilter(filterOption: any) {
    const option = _.find(this.filterOptions, {
      name: filterOption.name
    })
    this.filterOptions.forEach(type => {
      type.active = false;
    });
    option.active = true;
    this.onlyShowTitleImages = filterOption.name === 'only-title-images';
    this.updateGallery();
  }
}
