import { Appointment } from './appointment';

export class CourseInformation {
    uuid: string|undefined;
    shortId: string|undefined;
    title: string|undefined;
    description: string|undefined;
    image: string|undefined;
    youtubeId: string|undefined;
    appointmentUuids: string[]|undefined;
}
