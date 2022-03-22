import {Schema, Model, model} from "mongoose";
import Role from "../enums/roles";

export interface User {
    username: string;
    password: string;
    role: Role;
    loginAttempts: number;
    lockedUntil: Date;
}

export interface UserDocument extends User {
    createdAt: Date,
    updatedAt: Date
}

const userSchema: Schema<UserDocument> = new Schema<UserDocument>({
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: Number, required: true, default: Role.Anonymous},
        loginAttempts: {type: Number, required: true, default: 0},
        lockedUntil: {type: Date, required: true, default: new Date(0)}
    },
    {
        timestamps: true
    });

export const UserModel: Model<UserDocument> = model<UserDocument>("User", userSchema);