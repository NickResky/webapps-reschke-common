import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import 'rxjs/Rx';
import { DomSanitizer } from '@angular/platform-browser';
import { ModelService } from '../../services/model.service';
import { ZenkitCollectionsService } from '../../services/zenkit-collections.service';
import { PortfolioConfigService } from '../../services/portfolio-config-service';
import { UtilityService } from '../../../../services';
import { BlogPost } from '../../../../classes';

@Component({
  selector: 'app-portfolio-entry-01',
  templateUrl: './portfolio-entry-01.component.html',
  styleUrls: []
})
export class PortfolioEntry01Component implements OnInit {

  blogPost: BlogPost | undefined;
  private sub: any;
  blogPostShortId: string = '';

  myImages: any = [
    {
      preview: 'https://zenkit.com/api/v1/lists/Wn9wlV3aJ/files/FaAnZWklXi',
      full: 'https://zenkit.com/api/v1/lists/Wn9wlV3aJ/files/FaAnZWklXi',
      // width: 300, // used for masonry
      // height: 300, // used for masonry
      description: 'description of the image' // optional property
    }
  ];

  allImages: any;
  currentProjectImages: any;
  projectImages: any;
  
  myConfig = {
    masonry: true,
    masonryMaxHeight: 70
  };

  galleryConfig = {
    masonry: true,
		masonryMaxHeight: 100,
		masonryGutter: 6,
		loop: false,
		backgroundOpacity: 0.85,
		animationDuration: 100,
		counter: true,
		lightboxMaxHeight: '100vh - 86px',
		lightboxMaxWidth: '100%'
  };

  constructor(
      private modelService: ModelService,
      private route: ActivatedRoute,
      private domSanitizer: DomSanitizer,
      private zenkitCollectionsConfig: ZenkitCollectionsService,
      private portfolioConfig: PortfolioConfigService
    ) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (this.blogPostShortId !== params['shortId']) {
        this.modelService.setPageLoaded(false);
        this.blogPostShortId = params['shortId'];
        Promise.all([
          this.modelService.getPostByShortId(this.blogPostShortId),
          this.modelService.getPosts()
        ]).then((results) => {
          this.blogPost = results[0];
          const allPosts = results[1];

          this.currentProjectImages = _.map(this.blogPost.images, (image: any) => {
            return {
              imageData: image,
              shortId: image.shortId,
              isHovered: false
            }
          });

          this.projectImages = _.map(allPosts, (post) => {
            const firstImageData: any = _.head(post.images);
            return {
              imageData: firstImageData,
              shortId: firstImageData.shortId,
              routerLink: '/blog/' + post.shortId,
              title: post.title,
              isHovered: false
            }
          });
          this.modelService.setPageLoaded(true);
        });
      }
    });
  }

  getFileSrc(file: any) {
    return UtilityService.getFileSrc(_.get(file, ['shortId']), this.zenkitCollectionsConfig.current.shortId);
  }

  getBackgroundStyle(image: any) {
    return {
      'background-image': 'url(' + this.getFileSrc(image) + ')'
    };
  }

  getPostImageBackgroundStyle(post: any) {
    const image = _.head(post.images);
    return this.getBackgroundStyle(image);
  }

  getDateStringLong() {
    return UtilityService.convertDateToStringLong(this.blogPost.date);
  }

  getYoutubeLink() {
    const url = 'https://www.youtube.com/embed/'  + this.blogPost.youtubeVideoId;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
