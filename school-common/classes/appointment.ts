import { CourseInformation } from './course-information';
import { Teacher } from './teacher';
import { Location } from './location'

export class Appointment {
    uuid: string|undefined;
    shortId: string|undefined;
    title: string|undefined;
    dateStart: Date|undefined;
    dateEnd: Date|undefined;
    dayIndex: number|undefined;
    timeStartHours: number|undefined;
    timeStartMinutes: number|undefined;
    timeEndHours: number|undefined;
    timeEndMinutes: number|undefined;
    course: CourseInformation|undefined;
    teacher: Teacher|undefined;
    location: Location|undefined;
    levels: any[]|undefined;
    ageGroups: any[]|undefined;
    highlight: boolean|undefined;
}
