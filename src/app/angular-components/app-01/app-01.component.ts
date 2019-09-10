
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  isDeviceMobile = false;

  @ViewChild('appcontainer') appContainerElement: ElementRef;

  constructor(
    private router: Router,
    private modelService: ModelService,
    private seoService: SeoService) {
      this.seoService.addSeoData();
  }

  @HostListener('window:resize', ['$event'])
  onesize(event: any){
    console.log("App width: " + event.target.innerWidth);
    this.modelService.setAppWidth(event.target.innerWidth);
  }

  ngOnInit() {

    this.isBrowser = this.modelService.isPlatformBrowser();
    if (this.isBrowser) {
      console.log("Platform is browser");
      this.pageLoaded = false;
      this.removeOverlay = false;
    } else {
      console.log("Platform is server");
      this.pageLoaded = true;
      this.removeOverlay = true;
    }
    this.isDeviceMobile = this.modelService.isDeviceMobile();
    if (this.isDeviceMobile) {
      console.log("Device is mobile");
    } else {
      console.log("Device is not mobile");
    }
  }

  ngAfterViewInit() {

    const appContainerWidth = this.appContainerElement.nativeElement.clientWidth;
    console.log("App width: " + appContainerWidth);
    this.modelService.setAppWidth(appContainerWidth);

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
