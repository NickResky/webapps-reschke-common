export declare const UtilityService: {
    apiUrl: string;
    convertStringToUrlId: (string: string) => string;
    convertDateToString: (date: Date) => string | undefined;
    convertDateToStringLong: (date: Date) => string | undefined;
    getRequiredElementsByList: (listShortId: string, zenkitCollections: any) => any;
    getZenkitCollection: (listShortId: string, zenkitCollections: any) => any;
    getFileSrc: (fileShortId: string, listShortId: string) => string;
};
