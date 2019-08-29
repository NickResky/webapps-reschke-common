import { FooterLink } from './../school-common/classes/footer-link';

export class FooterConfigService {
    middleColumnTitle = '';
    displayMiddleColumnTitle = false;
    copyrightText = '';
    webdesignText = '';
    displayBorderLine = true;
    displayBackgroundColor = false;
    displaySmallLinkIcons = false;
    links: FooterLink[]|undefined;
}