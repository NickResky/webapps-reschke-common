import { NavigationElement } from './navigation-element';

export interface NavigationConfigType {
    title: string,
    titleHtml: string,
    displaySecondRow: boolean,
    pageInitiallyLoaded: boolean,
    showLoadingAnimationAfterInitialLoad: boolean,
    slideActive: false,
    slideOutAnimationActive: false,
    slideInAnimationActive: false,
    displayLoadingAnimationInNavbar: true,
    extendLoadingAnimationDuration: false,
    fadeInAnimationDurationInMs: number,
    navigationElements: NavigationElement[]
}