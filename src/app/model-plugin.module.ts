import { TeamService } from './services/team.service';
import { NgModule } from '@angular/core';

import { ModelService } from './services/model.service';
// import { CookiesNotificationComponent } from './angular-components/cookies-notification/cookies-notification.component';
import { CommonModule } from '@angular/common';
import { ContactService } from './services/contact.service';
import { CoursesService } from './services/courses.service';
import { CurrentService } from './services/current.service';
import { ImprintService } from './services/imprint.service';
import { MainPageService } from './services/main-page.service';
import { ScheduleService } from './services/schedule.service';
import { StageService } from './services/stage.service';
import { LocationsService } from './services/locations.service';

@NgModule()
export class ModelPluginModule { 

    static forRoot() {
        return {
            ngModule: ModelPluginModule,
            providers: [
                ModelService,
                ContactService,
                CoursesService,
                CurrentService,
                ImprintService,
                LocationsService,
                MainPageService,
                ScheduleService,
                StageService,
                TeamService
            ]
        }
    }

}