import { ModelService } from './../../services/model.service';
import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'wrc-cookies-notification-01',
  templateUrl: './cookies-notification.component.html',
  styleUrls: []
})
export class CookiesNotificationComponent01 implements OnInit {
  
  displayCookiesNotification = false;
  isBrowser = false;

  constructor(
    private modelService: ModelService
  ) { }

  ngOnInit() {
    let cookiesAcceptedStoredValue;

    this.isBrowser = this.modelService.isPlatformBrowser();

    if (this.isBrowser) {
      cookiesAcceptedStoredValue = localStorage.getItem('tth-cookies-accepted');
    }

    if (_.isNil(cookiesAcceptedStoredValue)) {
      this.displayCookiesNotification = true;
    }
  }

  acceptCookies() {
    this.displayCookiesNotification = false;
    if (this.modelService.isPlatformBrowser()) {
      localStorage.setItem('tth-cookies-accepted', 'true');
    }
  }
}
