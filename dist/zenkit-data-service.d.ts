import 'rxjs/Rx';
export declare class ZenkitDataService {
    constructor();
    apiUrl: string;
    headers: {
        'content-type': string;
    };
    getTestDataWithPromise(listId: string): Promise<any>;
    fetchAndTransformZenkitListData(params: any): Promise<any>;
    fetchList(listId: string): Promise<any>;
    fetchListElements(listId: any): Promise<any>;
    fetchListEntriesInKanbanMode(elementIdX: string, listShortId: string): Promise<any>;
    fetchZenkitListData(params: any): Promise<any>;
    transformZenkitListData(params: any): Promise<{}>;
    getFileSrc(fileShortId: string, listShortId: string): string;
}
