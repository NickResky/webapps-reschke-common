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

  constructor(
    private modelService: ModelService,
    private zenkitCollectionsConfig: ZenkitCollectionsService
  ) {

  }

  ngOnInit() {
    this.modelService.setPageLoaded(false);

    Promise.all([this.modelService.getPosts()]).then((results: any) => {
      this.posts = results[0];
      this.modelService.setPageLoaded(true);
    });
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

  getDateStringLong(date: Date) {
    return UtilityService.convertDateToStringLong(date);
  }
}
