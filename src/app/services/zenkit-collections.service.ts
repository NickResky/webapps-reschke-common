import { ApplicationIdentifier } from './../constants/application-identifier';
import { Injectable } from "@angular/core";

export class ZenkitCollectionsService {
  apiUrl: string = "";
  applicationIdentifier: ApplicationIdentifier = ApplicationIdentifier.UNDEFINED;
}