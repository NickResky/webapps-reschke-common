import { PortfolioConfigService } from './../../services/portfolio-config-service';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { ModelService } from './../../services/model.service';
import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { BlogPost } from '../../../../classes';
import { UtilityService } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as Hammer from 'hammerjs';
import * as propagating from 'propagating-hammerjs';

@Component({
  selector: 'wrc-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: []
})
export class ImageGalleryComponent implements OnInit {

  @Input() images: any;
  @Input() showMainImage: any;
  mainImageHeight = 0;
  mainPost: BlogPost;
  mainImage: any;
  galleryContainerWidth: number = 0;
  slideGalleryContainerHeight = 0;
  appWidth: number = 500;
  sliderFirstImageIndex = 0;
  sliderImageShowCount = 0;
  sliderImageWidth = 0;
  sliderImageHeight = 0;
  sliderImagePaddingTop = 0;
  sliderControlsWidth = 40;
  sliderPostHoveredCenter = false;
  sliderShowPrevButton = false;
  sliderShowNextButton = true;
  sliderPageIndex = 0;
  private sub: any;
  isBrowser: boolean;
  mouseOverStartTime: number;
  breakpointMedium = 576;
  isDeviceMobile = this.modelService.isDeviceMobile();

  @ViewChild('sliderelement') sliderElement: ElementRef;
  @ViewChild('gallerycontainerelement') galleryContainerElement: ElementRef;


  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    private portfolioConfig: PortfolioConfigService,
    private rd: Renderer2,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.findMainImage();

    this.isBrowser = this.modelService.isPlatformBrowser();

    this.sub = this.route.params.subscribe(params => { 
      if (this.isBrowser) {
        setTimeout(() => {
          this.findMainImage();
        }, 200);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    this.galleryContainerWidth = this.galleryContainerElement.nativeElement.clientWidth;
    console.log("gallery width: " + this.galleryContainerWidth);
    this.updateGallery();
  }

  ngAfterViewInit() {
    console.log(this.rd);

    this.modelService.getAppWidth().subscribe(
      (x) => {
        this.appWidth = x;
        this.galleryContainerWidth = this.galleryContainerElement.nativeElement.clientWidth;
        console.log("gallery width: " + this.galleryContainerWidth);
        this.updateGallery();
      }
    );

    const hammer1 = propagating(new Hammer(this.sliderElement.nativeElement));
    hammer1
      .on("swipeleft", (ev: any)=> {
        this.onSliderSwipeLeft();
        ev.stopPropagation();
      })
      .on("swiperight", (ev: any)=> {
        this.onSliderSwipeRight();
        ev.stopPropagation();
      });
  }

  onSliderSwipeLeft() {
    console.log("swipe left detected");
    if (this.images.length - this.sliderFirstImageIndex >= this.sliderImageShowCount) {
      this.sliderNext();
    }
  }

  onSliderSwipeRight() {
    console.log("swipe right detected");
    if (this.sliderFirstImageIndex >= this.sliderImageShowCount) {
      this.sliderPrev();
    }
  }

  findMainImage() {
    this.mainImage = _.find(this.images, {
      isActive: true
    });

    if (_.isNil(this.mainImage)) {
      this.mainImage = _.head(this.images);
    }
  }

  updateGallery() {
    if (this.appWidth < this.breakpointMedium) {
      this.sliderImageShowCount = 2;
    } else {
      this.sliderImageShowCount = 4;
    }

    this.sliderImageWidth = (this.galleryContainerWidth - (this.sliderControlsWidth * 2)) / this.sliderImageShowCount;
    this.mainImageHeight = (this.galleryContainerWidth / 16) * 9;
    this.sliderImageHeight = (this.sliderImageWidth / 16) * 9;
    this.slideGalleryContainerHeight = this.sliderImageHeight * 1.3;
    this.sliderImagePaddingTop = (this.slideGalleryContainerHeight - this.sliderImageHeight) / 2;

    if (this.sliderFirstImageIndex < this.sliderImageShowCount) {
      this.sliderShowPrevButton = false;
    } else {
      this.sliderShowPrevButton = true;
    }

    if (this.images.length - this.sliderFirstImageIndex < this.sliderImageShowCount + 1) {
      this.sliderShowNextButton = false;
    } else {
      this.sliderShowNextButton = true;
    }
  }

  getFileSrc(file: string) {
    return UtilityService.getFileSrc(_.get(file, ['shortId']), this.zenkitCollectionsConfig.current.shortId);
  }

  getBackgroundStyle(image: any) {
    let height;
    if (image.isHovered && !this.isDeviceMobile) {
      height = '100%';
    } else {
      height = this.sliderImageHeight + 'px';
    }
    return {
      'background-image': 'url(' + this.getFileSrc(image.imageData) + ')',
      'height': height,
    };
  }

  getImageBackgroundUrl(image: any) {
    return 'url(' + this.getFileSrc(image.imageData) + ')';
  }

  getDateStringLong(date: Date) {
    return UtilityService.convertDateToStringLong(date);
  }

  postMouseEnter(image: any) {
    this.mouseOverStartTime = Date.now();
    const currentImage: any = _.find(this.images,  {
      shortId: image.shortId
    });
    const imageIndex = _.findIndex(this.images, {
      shortId: image.shortId
    });
    if (this.appWidth < 576) {

    } else {
      if (imageIndex % this.sliderImageShowCount != 0) {
        this.sliderPostHoveredCenter = true;
      }
    }
    currentImage.isHovered = true;
  }

  postMouseLeave(image: any) {
    const currentImage: any = _.find(this.images,  {
      shortId: image.shortId
    });
    currentImage.isHovered = false;
    this.sliderPostHoveredCenter = false;
  }

  sliderNext() {
    this.sliderFirstImageIndex = this.sliderFirstImageIndex + this.sliderImageShowCount;
    this.sliderPageIndex++;
    this.updateGallery();
  }

  sliderPrev() {
    this.sliderFirstImageIndex = this.sliderFirstImageIndex - this.sliderImageShowCount;
    this.sliderPageIndex--;
    this.updateGallery();
  }

  clickThumbnail(image: any) {
    if (image.routerLink) {
      this.router.navigate([image.routerLink]);
    } else {
      this.mainImage = image;
    }
  }
}
