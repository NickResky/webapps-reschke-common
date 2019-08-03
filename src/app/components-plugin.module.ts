import { PortfolioOverview01Component } from './angular-components/portfolio-overview-01/portfolio-overview-01.component';
import { App01Component } from './angular-components/app-01/app-01.component';
import { Footer01Component } from './school-common/angular-components/footer/footer.component';
import { NgModule,Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';
import { Navigation01Component } from './angular-components/navigation-01/navigation-01.component';
import { RouterModule } from '@angular/router';
import { CookiesNotificationComponent01 } from './angular-components/cookies-notification/cookies-notification.component';

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
        PortfolioOverview01Component
    ], 
    exports: [
        PluginComponent,
        Footer01Component,
        App01Component,
        Navigation01Component,
        CookiesNotificationComponent01
    ]
})
export class ComponentsPluginModule { 

}