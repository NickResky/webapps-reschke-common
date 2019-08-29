import { PortfolioConfigService } from './../../services/portfolio-config-service';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { ModelService } from './../../services/model.service';
import { Component, OnInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { BlogPost } from '../../../../classes';
import { UtilityService } from '../../../../services';

@Component({
  selector: 'wrc-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: []
})
export class ImageGalleryComponent implements OnInit {

  posts: BlogPost[];
  mainImageHeight = 0;
  mainPost: BlogPost;
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


  @ViewChild('gallerycontainerelement') galleryContainerElement: ElementRef;

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    private portfolioConfig: PortfolioConfigService,
    private rd: Renderer2
  ) {

  }

  ngOnInit() {
    this.modelService.setPageLoaded(false);

    Promise.all([this.modelService.getPosts()]).then((results: any) => {
      this.posts = results[0];
      this.modelService.setPageLoaded(true);
      this.mainPost = _.head(this.posts);
      this.updateGallery();
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
      }
    );

    this.galleryContainerWidth = this.galleryContainerElement.nativeElement.clientWidth;
    console.log("gallery width: " + this.galleryContainerWidth);
  }

  updateGallery() {
    if (this.appWidth < 576) {
      this.sliderImageShowCount = 2;
    } else {
      this.sliderImageShowCount = 4;
    }

    this.sliderImageWidth = (this.galleryContainerWidth - (this.sliderControlsWidth * 2)) / this.sliderImageShowCount;
    this.mainImageHeight = (this.galleryContainerWidth / 16) * 9;
    this.sliderImageHeight = (this.sliderImageWidth / 16) * 9;
    this.slideGalleryContainerHeight = this.sliderImageHeight * 1.3;
    this.sliderImagePaddingTop = (this.slideGalleryContainerHeight - this.sliderImageHeight) / 2;

    if (this.sliderFirstImageIndex < (this.posts.length % this.sliderImageShowCount)) {
      this.sliderShowPrevButton = false;
    } else {
      this.sliderShowPrevButton = true;
    }

    if (this.posts.length - this.sliderFirstImageIndex < this.sliderImageShowCount) {
      this.sliderShowNextButton = false;
    } else {
      this.sliderShowNextButton = true;
    }
  }

  getFileSrc(file: string) {
    return UtilityService.getFileSrc(_.get(file, ['shortId']), this.zenkitCollectionsConfig.current.shortId);
  }

  getBackgroundStyle(image: string, post: BlogPost) {
    let height;
    if (post.isHovered) {
      height = '100%';
    } else {
      height = this.sliderImageHeight + 'px';
    }
    return {
      'background-image': 'url(' + this.getFileSrc(image) + ')',
      'height': height,
    };
  }

  getImageBackgroundUrl(post: BlogPost) {
    const mainImageString = _.head(_.get(post, ['images']));

    return 'url(' + this.getFileSrc(mainImageString) + ')';
  }

  getPostImageBackgroundStyle(post: BlogPost) {
    const image = _.head(post.images);
    return this.getBackgroundStyle(image, post);
  }

  getDateStringLong(date: Date) {
    return UtilityService.convertDateToStringLong(date);
  }

  postMouseEnter(post: BlogPost) {
    const currentPost = _.find(this.posts,  {
      shortId: post.shortId
    });
    const postIndex = _.findIndex(this.posts, {
      shortId: post.shortId
    });
    if (this.appWidth < 576) {

    } else {
      if (postIndex % this.sliderImageShowCount != 0) {
        this.sliderPostHoveredCenter = true;
      }
    }
    currentPost.isHovered = true;
    
  }

  postMouseLeave(post: BlogPost) {
    const currentPost = _.find(this.posts,  {
      shortId: post.shortId
    });
    currentPost.isHovered = false;
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
}
