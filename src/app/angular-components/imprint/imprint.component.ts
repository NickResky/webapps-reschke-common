
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Contact } from '../../../../classes';
import { ModelService } from '../../services/model.service';


@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: []
})
export class ImprintComponent implements OnInit {

  imprintData: string;

  ngOnInit() {
    this.modelService.setPageLoaded(false);
    this.modelService.getImprintData().then((result: any) => {
      this.imprintData = result;
      this.modelService.setPageLoaded(true);
    });
  }

  constructor(
    private modelService: ModelService
  ) {}

}
