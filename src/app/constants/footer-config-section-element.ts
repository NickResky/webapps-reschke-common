import { FooterConfigSectionElementTypes } from './footer-config-section-element-types';
import { ZenkitElementInfo } from "./zenkit-element-info";

export interface FooterConfigSectionElement {
    type: FooterConfigSectionElementTypes,
    text: string,
    icon: string,
    routerLink: string
};
