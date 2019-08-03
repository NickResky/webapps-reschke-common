import { NavigationElement } from './navigation-element';

export interface NavigationConfigType {
    title: string,
    titleHtml: string,
    displaySecondRow: boolean,
    pageInitiallyLoaded: boolean,
    showLoadingAnimationAfterInitialLoad: boolean,
    navigationElements: NavigationElement[]
}