import { CookiesNotificationComponent } from './angular-components/cookies-notification/cookies-notification.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';

@NgModule({
    imports: [CommonModule],
    declarations: [
        CookiesNotificationComponent,
        PluginComponent
    ]
})
export class ComponentsPluginModule { 

}