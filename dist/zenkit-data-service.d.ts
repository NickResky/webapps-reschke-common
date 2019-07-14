import 'rxjs/Rx';
export declare const ZenkitDataService: {
    apiUrl: string;
    headers: {
        'content-type': string;
    };
    getZenkitListData: (params: any) => Promise<any>;
    getTestDataWithPromise: (listId: string) => Promise<any>;
    fetchAndTransformZenkitListData: (params: any) => Promise<any>;
    fetchList: (listId: string) => Promise<any>;
    fetchListElements: (listId: any) => Promise<any>;
    fetchListEntriesInKanbanMode: (elementIdX: string, listShortId: string) => Promise<any>;
    fetchZenkitListData: (params: any) => Promise<any>;
    transformZenkitListData: (params: any) => Promise<{}>;
};
