import { Model } from "mongoose";
import { User } from "../../entities/user.entity";
import { IUserRepository } from "../../port/user-repository.interface";
import { MongoUser } from "./mongo-user";

class UserMapper {
    toCore(model: MongoUser.UserDocument): User {
        return new User({
            id: model._id,
            emailAddress: model.emailAddress,
            password: model.password,
            reservations: model.reservations.map(reservation => ({
                conferenceId: reservation.conferenceId,
                seats: reservation.seats
            }))
        });
    }

    toPersistence(user: User): MongoUser.UserDocument {
        return new MongoUser.UserModel({
            _id: user.props.id,
            emailAddress: user.props.emailAddress,
            password: user.props.password,
            reservations: (user.props.reservations || []).map(reservation => ({
                conferenceId: reservation.conferenceId,
                seats: reservation.seats
            }))
        });
    }
}

export class MongoUserRepository implements IUserRepository {
    private readonly mapper = new UserMapper();

    constructor(private readonly model: Model<MongoUser.UserDocument>) {

    }

    async findByEmailAddress(emailAddress: string): Promise<User | null> {
        const user = await this.model.findOne({ emailAddress });
        if (!user) return null;
        return this.mapper.toCore(user);
    }

    async create(user: User): Promise<void> {
        const record = this.mapper.toPersistence(user);
        await record.save();
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.model.findOne({ _id: id });
        if (!user) return null;
        return this.mapper.toCore(user);
    }

    async bookSeats(userId: string, conferenceId: string, seats: number): Promise<void> {
        const user = await this.model.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        user.reservations.push({ conferenceId, seats });
        await user.save();
    }

    async getBookedSeats(userId: string): Promise<number> {
        const user = await this.model.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }

        return user.reservations.reduce((total, reservation) => total + reservation.seats, 0);
    }
}