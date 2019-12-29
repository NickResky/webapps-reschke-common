import { BlogPostEntryComponent } from './angular-components/blog-post-entry/blog-post-entry.component';
import { PortfolioEntry01Component } from './angular-components/portfolio-entry-01/portfolio-entry-01.component';
import { PortfolioOverview01Component } from './angular-components/portfolio-overview-01/portfolio-overview-01.component';
import { App01Component } from './angular-components/app-01/app-01.component';
import { Footer01Component } from './school-common/angular-components/footer/footer.component';
import { NgModule,Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';
import { Navigation01Component } from './angular-components/navigation-01/navigation-01.component';
import { RouterModule } from '@angular/router';
import { CookiesNotificationComponent01 } from './angular-components/cookies-notification/cookies-notification.component';
import { ImageGalleryComponent } from './angular-components/image-gallery/image-gallery.component';
import { ImprintComponent } from './angular-components/imprint/imprint.component';
import { PrivacyComponent } from './angular-components/privacy/privacy.component';
import { ImageGallery02Component } from './angular-components/image-gallery-02/image-gallery-02.component';
import { LeonSansAnimationComponent } from './angular-components/leon-sans-animation/leon-sans-animation.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        PluginComponent,
        Footer01Component,
        App01Component,
        Navigation01Component,
        CookiesNotificationComponent01,
        PortfolioOverview01Component,
        PortfolioEntry01Component,
        ImageGalleryComponent,
        ImageGallery02Component,
        ImprintComponent,
        PrivacyComponent,
        LeonSansAnimationComponent,
        BlogPostEntryComponent
    ], 
    exports: [
        PluginComponent,
        Footer01Component,
        App01Component,
        Navigation01Component,
        CookiesNotificationComponent01,
        PortfolioOverview01Component,
        PortfolioEntry01Component,
        ImageGalleryComponent,
        ImageGallery02Component,
        ImprintComponent,
        PrivacyComponent,
        LeonSansAnimationComponent,
        BlogPostEntryComponent
    ]
})
export class ComponentsPluginModule { 

}