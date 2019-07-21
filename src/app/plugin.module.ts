import { 
  ContactService,
  CoursesService,
  CurrentService,
  ImprintService,
  LocationsService,
  MainPageService,
  ScheduleService,
  SeoService,
  StageService,
  TeamService
} from '../../services';
import { ModelService } from './services/model.service';
// import { CookiesNotificationComponent } from './angular-components/cookies-notification/cookies-notification.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginComponent } from './plugin.component';

@NgModule()
export class PluginModule { 

    static forRoot() {
        return {
            ngModule: PluginModule,
            providers: [
                ModelService,
                ContactService,
                CoursesService,
                CurrentService,
                ImprintService,
                LocationsService,
                MainPageService,
                ScheduleService,
                SeoService,
                StageService,
                TeamService
            ]
        }
    }

}