import mongoose, { Schema, Document } from 'mongoose';

const ReservationSchema = new Schema({
    conferenceId: { type: String, required: true },
    seats: { type: Number, required: true }
});

export namespace MongoUser {
    export interface UserDocument extends Document {
        _id: string;
        emailAddress: string;
        password: string;
        reservations: { conferenceId: string; seats: number }[];
    }

    const UserSchema = new Schema({
        _id: { type: String, required: true },
        emailAddress: { type: String, required: true },
        password: { type: String, required: true },
        reservations: [ReservationSchema]
    });

    export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
}