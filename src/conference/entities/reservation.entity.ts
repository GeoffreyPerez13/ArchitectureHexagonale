import { Entity } from "../../core/entities/entity";

type ReservationProps = {
    id: string;
    conferenceId: string;
};

export class Reservation extends Entity<ReservationProps> {
}