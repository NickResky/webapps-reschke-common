import { NavigationElement } from "../school-common/classes/navigation-element";

export class NavigationConfigService {
    title: string = '';
    titleHtml: string = '';
    displaySecondRow = false;
    pageInitiallyLoaded = false;
    showLoadingAnimationAfterInitialLoad = true;
    navigationElements: NavigationElement[]|undefined;
}