import { ZenkitDataService } from './zenkit-data-service';

const zenkitDataService = new ZenkitDataService();

export function printMsg () {
    console.log("This is a message from the demo package");
}

export { UtilityService } from './utility.service';

/*
    params
    {
        listShortId: string
        requiredElements: {}[]
    }
*/
export function getZenkitListData(params: any): Promise<any> {
    return zenkitDataService.fetchAndTransformZenkitListData(params);
}