import { Entity } from "../../core/entities/entity"

type ReservationProps = {
    conferenceId: string;
    seats: number;
};

type UserProps = {
    id: string,
    emailAddress: string,
    password: string,
    reservations?: ReservationProps[];
}

export class User extends Entity<UserProps> {
    
}