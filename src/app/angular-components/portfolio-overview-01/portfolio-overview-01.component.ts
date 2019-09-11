import { isPlatformBrowser } from '@angular/common';
import { PortfolioConfigService } from './../../services/portfolio-config-service';
import { ZenkitCollectionsService } from './../../services/zenkit-collections.service';
import { ModelService } from './../../services/model.service';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { BlogPost } from '../../../../classes';
import { UtilityService } from '../../../../services';

@Component({
  selector: 'wrc-portfolio-overview-01',
  templateUrl: './portfolio-overview-01.component.html',
  styleUrls: []
})
export class PortfolioOverview01Component implements OnInit {

  posts: BlogPost[]|undefined;
  allImagesLoaded = false;
  allImagesLoadedTimeout = 4000;
  allImagesLoadedTimeoutPassed = false;
  isBrowser = this.modelService.isPlatformBrowser();

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService,
    public portfolioConfig: PortfolioConfigService
  ) {

  }

  ngOnInit() {
    this.modelService.setPageLoaded(false);

    Promise.all([this.modelService.getPosts()]).then((results: any) => {
      this.posts = results[0];
      this.posts = _.orderBy(this.posts, ['date'], ['desc']);
      this.modelService.setPageLoaded(true);
    });

    if (this.isBrowser) {
      setTimeout(() => {
        this.allImagesLoadedTimeoutPassed = true;
      }, this.allImagesLoadedTimeout)
    }
  }

  getFileSrc(file: string) {
    return UtilityService.getFileSrc(_.get(file, ['shortId']), this.zenkitCollectionsConfig.current.shortId);
  }

  getBackgroundStyle(image: string) {
    return {
      'background-image': 'url(' + this.getFileSrc(image) + ')'
    };
  }

  getPostImageBackgroundStyle(post: BlogPost) {
    const image = _.head(post.images);
    return this.getBackgroundStyle(image);
  }

  getPostImageUrl(post: BlogPost) {
    const image: string = _.head(post.images);
    return this.getFileSrc(image);
  }

  getDateStringLong(date: Date) {
    return UtilityService.convertDateToStringLong(date);
  }

  imageLoaded(post: BlogPost) {
    const currentBlogPost = _.find(this.posts, {
      shortId: post.shortId
    });
    currentBlogPost.imageLoaded = true;

    const foundUnloadedImage = _.find(this.posts, (p)=> {
      return p.imageLoaded != true
    });
    if (_.isNil(foundUnloadedImage)) {
      this.allImagesLoaded = true;
    }
  }
}
