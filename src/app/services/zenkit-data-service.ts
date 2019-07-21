import { ElementTypes } from './../constants/zenkit-element-types';
import * as _ from 'lodash';
import 'rxjs/Rx';

export const ZenkitDataService = {

    // production
    apiUrl: 'https://zenkit.com/api/v1/',
    headers: {
      'content-type': 'application/json; charset=UTF-8'
    },
    // development
    // apiUrl = 'https://localhost:9000/api/v1/';
  
    // Only necessary if zenkit collection is not public
    // TODO: Remove before release
    // headers.append('Authorization', 'Bearer ' + ZenkitDataService.apiToken);

    getZenkitListData: (params: any): Promise<any> => {
        return ZenkitDataService.fetchAndTransformZenkitListData(params);
    },
  
    getTestDataWithPromise: (listId: string): Promise<any> => {
      const url = ZenkitDataService.apiUrl + 'lists/' + listId + '/elements';
      const httpParams = {
          headers: ZenkitDataService.headers,
          // body: Data,
          method: "GET"
      };
      return fetch(url, httpParams)
        .then((res: any) => {
          return new Promise((resolve: any, reject: any) => {
            return resolve(res.json());
          });
        });
    },
  
    /*
      params
      {
          listShortId: string
          requiredElements: {}[]
      }
    */
    fetchAndTransformZenkitListData: (params: any): Promise<any> => {
      if (_.isNil(params.listShortId)) {
        throw new Error('Parameter "listShortId" not defined!');
      }
      if (_.isNil(params.requiredElements)) {
          throw new Error('Parameter "requiredElements" not defined!');
      }
      return ZenkitDataService.fetchZenkitListData(params)
        .then((results) => {
          return ZenkitDataService.transformZenkitListData(results);
        });
    },
  
    fetchList: (listId: string): Promise<any> => {
      const url = ZenkitDataService.apiUrl + 'lists/' + listId;
      const httpParams = {
          headers: ZenkitDataService.headers,
          // body: Data,
          method: "GET"
      };
      // httpParams.headers.append('Authorization', 'Bearer ' + ZenkitDataService.apiToken);
      return fetch(url, httpParams)
    },
  
    fetchListElements: (listId: any): Promise<any> => {
      const url = ZenkitDataService.apiUrl + 'lists/' + listId + '/elements';
      const httpParams = {
          headers: ZenkitDataService.headers,
          // body: Data,
          method: "GET"
      };
      // headers.append('Authorization', 'Bearer ' + ZenkitDataService.apiToken);
      return fetch(url, httpParams);
    },
  
    fetchListEntriesInKanbanMode: (elementIdX: string, listShortId:string): Promise<any> => {
      const url = ZenkitDataService.apiUrl + 'lists/' + listShortId + '/entries/filter/kanban';
      // headers.append('Authorization', 'Bearer ' + ZenkitDataService.apiToken);
      const httpRequestBody: any = {
        filter: {
          AND: {
            TERMS: []
          }
        },
        elementIdX: elementIdX
      };
      const httpParams = {
          headers: ZenkitDataService.headers,
          body: JSON.stringify(httpRequestBody),
          method: "POST"
      };
      return fetch(url, httpParams);
    },
  
    fetchZenkitListData: (params: any): Promise<any> => {
  
        return Promise.all([ZenkitDataService.fetchList(params.listShortId), ZenkitDataService.fetchListElements(params.listShortId)]).then((results: any) => {
          const listResponse: any = results[0];
          const elementsResponse: any = results[1];
  
          if (listResponse.status === 403  || listResponse.status === 403) {
            throw new Error('It seems like you do not have permission to access this collection');
          }
          if (listResponse.status !== 200 || listResponse.status !== 200) {
            throw new Error('Collection not found.');
          }
  
          return Promise.all([listResponse.json(), elementsResponse.json()]).then((results: any) => {
  
            const listJson = results[0];
            const elementsJson = results[1];
  
            const sectionElement: any = _.find(elementsJson, {
              name: 'Labels',
              elementcategory: 6
            });
  
            if (_.has(sectionElement, ['id']) === false) {
              // tslint:disable-next-line:max-line-length
              throw new Error('Missing Section Field! Please define a field called "Labels" for the Zenkit Collection ' + listJson.name + '.');
            }
  
            return ZenkitDataService.fetchListEntriesInKanbanMode(sectionElement.id, params.listShortId)
              .then((entriesResponse) => {
  
                if (entriesResponse.status === 403) {
                  throw new Error('It seems like you do not have permission to access this collection (Collection ID:' + params.listId + ').');
                }
  
                if (entriesResponse.status !== 200) {
                  throw new Error('Collection not found (Collection ID: ' + params.listShortId + ').');
                }
  
                return entriesResponse.json().then((entriesJsonResponse: any) => {
                  return {
                    list: listJson,
                    elements: elementsJson,
                    kanbanEntries: entriesJsonResponse,
                    sectionElement: sectionElement,
                    requiredElements: params.requiredElements
                  };
                });
              });
            });
      });
    },
  
    transformZenkitListData: (params: any): Promise<{}> => {
  
      const predefinedCategories: any = {};
  
      const modifiedRequiredElements = _
        .map(params.requiredElements, (requiredElement: any) => {
          const fullElement: any = _.find(params.elements, {
            name: requiredElement.name
          });
          if (_.isNil(fullElement)) {
            throw new Error('Element ' + requiredElement.name + ' in the Collection ' + params.list.name + ' was not found.');
          }
          // Save element data for labels
          if (_.isEqual(requiredElement.type, ElementTypes.labels)) {
            requiredElement.predefinedCategories = fullElement.elementData.predefinedCategories;
            const predefinedCategory = _.map(requiredElement.predefinedCategories, (c) => {
              return {
                name: c.name,
                id: c.id,
                colorHex: c.colorHex
              };
            });
            predefinedCategories[requiredElement.mappedClassPropertyName] = (predefinedCategory);
          }
          requiredElement.uuid = fullElement.uuid;
          return requiredElement;
        });
  
      const modifiedEntries = _
        .map(params.kanbanEntries.kanbanData, (entry) => {
  
          const labelIds: any[] = entry[params.sectionElement.uuid + '_categories'];
          const label = _.find(params.sectionElement.elementData.predefinedCategories, {
            id: _.head(labelIds)
          });
  
          const simplifiedEntry = {
            label: _.get(label, ['name']),
            uuid: entry.uuid,
            shortId: entry.shortId
          };
  
          return _.reduce(modifiedRequiredElements, (modifiedEntry: any, modifiedElement) => {
            // Handle label elements
            let value;
            if (_.isEqual(modifiedElement.type,  ElementTypes.labels)) {
              const labelsIds1 = entry[modifiedElement.uuid + '_' + modifiedElement.type.category];
  
              if (_.isEmpty(labelsIds1) === false) {
                value = _.map(labelsIds1, (labelId) => {
                  const label = _.find(modifiedElement.predefinedCategories, {
                    id: labelId
                  });
                  return _.get(label, ['name']);
                });
              }
            // Handle other elements
            } else {
              value = entry[modifiedElement.uuid + '_' + modifiedElement.type.category];
            }
            modifiedEntry[modifiedElement.mappedClassPropertyName] = value;
            return modifiedEntry;
          }, simplifiedEntry);
        });
      return new Promise((resolve: any, reject: any) => {
        return resolve({
          entries: modifiedEntries,
          prefefinedCategories: predefinedCategories
        });
      });
    }
}
  
  
  