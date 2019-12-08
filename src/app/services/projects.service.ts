import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BlogPost } from '../../../classes';
import { ZenkitDataService } from './zenkit-data-service';
import { UtilityService } from './utility.service';

@Injectable()
export class ProjectsService {

  constructor() { }

  getProjects(zenkitCollections: any): Promise<BlogPost[]> {
    return new Promise((resolve, reject) => {
      const listShortId = zenkitCollections.projects.shortId;
      return ZenkitDataService.getZenkitListData({
        listShortId: listShortId,
        requiredElements: UtilityService.getRequiredElementsByList(listShortId, zenkitCollections)
      }).then((zenkitListData) => {
          let posts: BlogPost[] = _.map(zenkitListData.entries, (modifiedEntry) => {
            const blogPost = new BlogPost();
            blogPost.shortId = modifiedEntry.shortId;
            blogPost.title = modifiedEntry.title;
            blogPost.description = modifiedEntry.description;
            blogPost.images = modifiedEntry.images;
            blogPost.youtubeVideoId = modifiedEntry.youtubeVideoId;
            blogPost.date = modifiedEntry.date;
            if (_.isNil(modifiedEntry.date) === false) {
              blogPost.date = new Date(modifiedEntry.date);
            }
            if (blogPost.title && blogPost.date) {
              const dateString = UtilityService.convertDateToString(blogPost.date);
              blogPost.routerLink =
                '/blog/' +
                blogPost.shortId +
                '/' +
                UtilityService.convertStringToUrlId(blogPost.title) 
                + '/' +
                UtilityService.convertStringToUrlId(dateString);
            } else {
              blogPost.routerLink = '/blog/' + blogPost.shortId;
            }
            return blogPost;
          });
          posts = posts.reverse(); // newest posts should be first
          return resolve(posts);
      });
    });
  }
}
