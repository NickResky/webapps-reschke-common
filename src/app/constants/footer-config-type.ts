import { FooterConfigSection } from './footer-config-section';
import { FooterLink } from '../school-common/classes/footer-link';

export interface FooterConfigType {
    middleColumnTitle: string;
    displayMiddleColumnTitle: boolean;
    copyrightText: string;
    webdesignText: string;
    displayBorderLine: boolean;
    displayBackgroundColor: boolean;
    displaySmallLinkIcons: boolean;
    displaySocialSection: boolean;
    displaySectionHeadings: boolean;
    displayContactSection: boolean;
    links: FooterLink[]|undefined;
    footerSections: any[]
}