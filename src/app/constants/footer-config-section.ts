import { FooterConfigSectionElement } from './footer-config-section-element';

export interface FooterConfigSection {
    title: string,
    displayElementsInline: boolean,
    displayDashesBetweenElements: boolean
    elements: FooterConfigSectionElement[]
};
