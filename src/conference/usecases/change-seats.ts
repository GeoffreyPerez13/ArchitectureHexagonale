import { User } from "../../user/entities/user.entity"
import { IConferenceRepository } from "../ports/conference-repository.interface"

type RequestChangeSeats = {
    user: User,
    conferenceId: string,
    seats: number
}

type ResponseChangeSeats = void

export class ChangeSeats {
    constructor(private readonly repository:IConferenceRepository) {}

    async execute({user, conferenceId, seats}: RequestChangeSeats): Promise<ResponseChangeSeats> {
        const conference = await this.repository.findById(conferenceId)
       
        if(!conference) throw new Error('Conference not found')

        if(conference.props.id != user.props.id) throw new Error('You are not allowed to update this conference')

        conference!.update({seats})
    }
}