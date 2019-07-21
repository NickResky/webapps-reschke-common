import { CookiesNotificationComponent } from './angular-components/cookies-notification/cookies-notification.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';

@NgModule()
export class ComponentsPluginModule { 
    static forRoot() {
        return {
            ngModule: ComponentsPluginModule,
            declarations: [
                CookiesNotificationComponent
            ]
        }
    }
}