import {LeanDocument} from "mongoose";
import {UserDocument, UserModel, User} from "../models/user.model";

export default class UserRepository {
    async getUser(username: string): Promise<LeanDocument<UserDocument>> {
        return UserModel
            .findOne({username: username})
            .lean();
    }

    async createUser(username: string, password: string): Promise<LeanDocument<UserDocument>> {
        return (await (await UserModel
            .create({username: username, password: password})).save())
            .toObject();
    }

    async updateUser(user: User) {
        return UserModel.updateOne({username: user.username}, user)
    }
}