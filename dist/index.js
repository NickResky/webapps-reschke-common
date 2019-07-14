"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zenkit_data_service_1 = require("./zenkit-data-service");
const zenkitDataService = new zenkit_data_service_1.ZenkitDataService();
function printMsg() {
    console.log("This is a message from the demo package");
}
exports.printMsg = printMsg;
var utility_service_1 = require("./utility.service");
exports.UtilityService = utility_service_1.UtilityService;
/*
    params
    {
        listShortId: string
        requiredElements: {}[]
    }
*/
function getZenkitListData(params) {
    return zenkitDataService.fetchAndTransformZenkitListData(params);
}
exports.getZenkitListData = getZenkitListData;
