import { FooterConfigSection } from './../constants/footer-config-section';
import { FooterLink } from './../school-common/classes/footer-link';

export class FooterConfigService {
    middleColumnTitle = '';
    displayMiddleColumnTitle = false;
    copyrightText = '';
    webdesignText = '';
    displayBorderLine = true;
    displayBackgroundColor = false;
    displaySmallLinkIcons = false;
    displaySocialSection = true;
    displaySectionHeadings = true;
    links: FooterLink[]|undefined;
    sections: FooterConfigSection[]
}