import { ZenkitDataService } from './zenkit-data-service';

export function printMsg () {
    console.log("This is a message from the demo package");
}

export { UtilityService } from './utility.service';
export { ZenkitDataService } from './zenkit-data-service';

/*
    params
    {
        listShortId: string
        requiredElements: {}[]
    }
*/
export function getZenkitListData(params: any): Promise<any> {
    return ZenkitDataService.fetchAndTransformZenkitListData(params);
}