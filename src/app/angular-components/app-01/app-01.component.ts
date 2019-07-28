
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ModelService } from '../../services/model.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'wrc-root',
  templateUrl: './app-01.component.html',
  styleUrls: ['./app-01.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class App01Component implements OnInit {
  title = 'app';
  pageLoaded = false;
  removeOverlay = false;
  isBrowser = false;

  constructor(
    private router: Router,
    private modelService: ModelService,
    private seoService: SeoService) {
      this.seoService.addSeoData();
  }

  ngOnInit() {

    this.isBrowser = this.modelService.isPlatformBrowser();
    if (this.isBrowser) {
      this.pageLoaded = false;
      this.removeOverlay = false;
    } else {
      this.pageLoaded = true;
      this.removeOverlay = true;
    }

    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        if (this.modelService.isPlatformBrowser()) {
          window.scrollTo(0, 0);
        }
    });

    this.modelService.isPageLoaded().subscribe(
        (x) => {
          if (this.modelService.isPlatformBrowser()) {
            this.pageLoaded = x;
            this.removeOverlay = x;
          }
        }
    );
  }
}
