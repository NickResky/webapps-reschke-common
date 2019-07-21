import { RequiredElementsConfig } from './required-elements-config';
import { ZenkitCollection } from './zenkit-collection';

export interface ZenkitCollectionsConfig {
    apiUrl : string,
    home: ZenkitCollection,
    current: ZenkitCollection
    performances: ZenkitCollection
    courses: ZenkitCollection
    schedule: ZenkitCollection
    team: ZenkitCollection,
    locations: ZenkitCollection,
    contact: ZenkitCollection,
    imprint: ZenkitCollection
};
