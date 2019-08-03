import { NavigationElement } from "../school-common/classes/navigation-element";

export class NavigationConfigService {
    title: string = '';
    titleHtml: string = '';
    displaySecondRow = false;
    navigationElements: NavigationElement[]|undefined;
}