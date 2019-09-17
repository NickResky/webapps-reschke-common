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

  galleryImages: any;
  posts: BlogPost[]|undefined;
  isBrowser = this.modelService.isPlatformBrowser();
  pageLoaded = false;

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

      this.galleryImages = _.map(this.posts, (post) => {
        const firstImageData: any = _.head(post.images);
        return {
          imageData: firstImageData,
          shortId: firstImageData.shortId,
          url: UtilityService.getFileSrc(firstImageData.shortId, this.zenkitCollectionsConfig.current.shortId),
          routerLink: '/projekte/' + post.shortId,
          title: post.title,
          description: '',
          imageLoaded: false
        }
      });
      this.modelService.setPageLoaded(true);
    });

    this.modelService.isPageLoaded().subscribe(
      (x) => {
        this.pageLoaded = x;
      }
    );
  }
}
