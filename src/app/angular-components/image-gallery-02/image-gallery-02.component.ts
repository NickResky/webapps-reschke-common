import { NavigationConfigService } from './../../services/navigation-config-service';
import { isPlatformBrowser } from '@angular/common';
import { PortfolioConfigService } from './../../services/portfolio-config-service';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { ModelService } from './../../services/model.service';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { BlogPost } from '../../../../classes';
import { UtilityService } from '../../../../services';

@Component({
  selector: 'wrc-image-gallery-02',
  templateUrl: './image-gallery-02.component.html',
  styleUrls: []
})
export class ImageGallery02Component implements OnInit {

  @Input() images: any;
  allImagesLoaded = false;
  allImagesLoadedTimeout = 4000;
  allImagesLoadedTimeoutPassed = false;
  isBrowser = this.modelService.isPlatformBrowser();
  pageLoaded = false;
  pageInitiallyLoaded = false;

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    public portfolioConfig: PortfolioConfigService,
    private navigationConfig: NavigationConfigService
  ) {

  }

  ngOnInit() {
    this.modelService.setPageLoaded(false);

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
}
