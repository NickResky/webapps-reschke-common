"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zenkit_data_service_1 = require("./zenkit-data-service");
function printMsg() {
    console.log("This is a message from the demo package");
}
exports.printMsg = printMsg;
var utility_service_1 = require("./utility.service");
exports.UtilityService = utility_service_1.UtilityService;
var zenkit_data_service_2 = require("./zenkit-data-service");
exports.ZenkitDataService = zenkit_data_service_2.ZenkitDataService;
/*
    params
    {
        listShortId: string
        requiredElements: {}[]
    }
*/
function getZenkitListData(params) {
    return zenkit_data_service_1.ZenkitDataService.fetchAndTransformZenkitListData(params);
}
exports.getZenkitListData = getZenkitListData;
