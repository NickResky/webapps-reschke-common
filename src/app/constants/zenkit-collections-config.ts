import { ApplicationIdentifier } from './application-identifier';
import { RequiredElementsConfig } from './required-elements-config';
import { ZenkitCollection } from './zenkit-collection';

export interface ZenkitCollectionsConfig {
    apiUrl : string,
    applicationIdentifier: ApplicationIdentifier,
    home: ZenkitCollection,
    current: ZenkitCollection,
    projects: ZenkitCollection,
    performances: ZenkitCollection
    courses: ZenkitCollection
    schedule: ZenkitCollection
    team: ZenkitCollection,
    locations: ZenkitCollection,
    contact: ZenkitCollection,
    imprint: ZenkitCollection
};
