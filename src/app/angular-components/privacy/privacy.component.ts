
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Contact } from '../../../../classes';
import { ModelService } from '../../services/model.service';


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: []
})
export class PrivacyComponent implements OnInit {

  privacyData: string;

  ngOnInit() {
    this.modelService.setPageLoaded(false);
    this.modelService.getPrivacyData().then((result: any) => {
      this.privacyData = result;
      this.modelService.setPageLoaded(true);
    });
  }

  constructor(
    private modelService: ModelService
  ) {}

}
