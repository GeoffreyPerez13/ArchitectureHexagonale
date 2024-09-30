import { differenceInDays } from "date-fns";
import { Conference } from "../entities/conference.entity";
import { IConferenceRepository } from "../ports/conference-repository.interface";
import { IDateGenerator } from "../ports/date-generator.interface";
import { IIDGenerator } from "../ports/id-generator.interface";
import { User } from "../entities/user.entity";

export class OrganizeConference {

    constructor(
        private readonly repository: IConferenceRepository,
        private readonly idGenerator: IIDGenerator,
        private readonly dateGenerator: IDateGenerator
    ) {}

    async execute(data: {user: User, title: string, startDate: Date, endDate: Date, seats: number}) {
        const id = this.idGenerator.generate()
        const newConference = new Conference({
            id,
            organizerId: data.user.props.id,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            seats: data.seats
        })
        
        if(newConference.isTooClose(this.dateGenerator.now())) {
            throw new Error("The conference must happen in at least 3 days");  
        }

        if(newConference.hasTooManySeats()) {
            throw new Error("The conference must have a maximum of 1000 seats");
            
        }

        if(newConference.hasNotEnoughSeats()) {
            throw new Error("The conference must have at least 20 seats");
        }
        
        if(newConference.isTooLong()) {
            throw new Error("The conference is too long (> 3 hours)");
        }

        await this.repository.create(newConference)

        return { id }
    }
}