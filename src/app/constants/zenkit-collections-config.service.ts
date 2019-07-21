import { ZenkitCollectionsConfig } from './zenkit-collections-config';
import { InjectionToken } from '@angular/core';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionTToken used to import the config object, provided from the outside
 */
export const ZenkitCollectionsConfigService = new InjectionToken<ZenkitCollectionsConfig>("ZenkitCollectionsConfig");
