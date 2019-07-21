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
import { ZenkitCollectionsConfigService } from './constants/zenkit-collections-config.service';

@NgModule()
export class ModelPluginModule { 

    static forRoot(zenkitCollections: any) {
        return {
            ngModule: ModelPluginModule,
            providers: [
                {
                    provide: ZenkitCollectionsConfigService,
                    useValue: zenkitCollections
                },
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