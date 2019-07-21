import { ZenkitElementInfo } from './zenkit-element-info';

export interface RequiredElements {
    home: ZenkitElementInfo[],
    current: ZenkitElementInfo[],
    performances: ZenkitElementInfo[],
    courses: ZenkitElementInfo[],
    schedule: ZenkitElementInfo[],
    team: ZenkitElementInfo[],
    locations: ZenkitElementInfo[], 
    contact: ZenkitElementInfo[],
    imprint: ZenkitElementInfo[],

};
