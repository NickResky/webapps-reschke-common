import { ZenkitElementInfo } from "./zenkit-element-info";

export interface ZenkitCollection {
    shortId: string,
    requiredElements: ZenkitElementInfo[]
};
