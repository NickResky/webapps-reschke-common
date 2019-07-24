import { NgModule } from '@angular/core';
import { 
  ContactService,
  CoursesService,
  CurrentService,
  ImprintService,
  LocationsService,
  MainPageService,
  ScheduleService,
  StageService,
  TeamService
} from '../../services';
import { ModelService } from './services/model.service';
// import { CookiesNotificationComponent } from './angular-components/cookies-notification/cookies-notification.component';
import { CommonModule } from '@angular/common';

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