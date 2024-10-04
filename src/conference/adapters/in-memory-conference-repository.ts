import { Conference } from "../entities/conference.entity"
import { Reservation } from "../entities/reservation.entity";
import { IConferenceRepository } from "../ports/conference-repository.interface"

export class InMemoryConferenceRepository implements IConferenceRepository {
    public database: Conference[] = []; // mon test passe en mettant database en public, mais bonne méthode?
    private reservations: Reservation[] = [];

    async create(conference: Conference): Promise<void> {
        this.database.push(conference);
    }

    async findById(id: string): Promise<Conference | null> {
        const conference = this.database.find(conf => conf.props.id === id);
        return conference ? new Conference({...conference.initialState}) : null;
    }

    async update(conference: Conference): Promise<void> {
        const index = this.database.findIndex(conf => conf.props.id === conference.props.id);
        this.database[index] = conference;
        conference.commit();
    }

    async bookedSeats(id: string): Promise<number> {
        return this.reservations.filter(reservation => reservation.props.conferenceId === id).length;
    }
}