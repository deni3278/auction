import {injectable} from "tsyringe";
import UserRepository from "../repositories/user.repository";
import {User, UserDocument} from "../models/user.model";
import {LeanDocument} from "mongoose";
import bcrypt from "bcrypt";
import {generateJWT} from "../utils/auth.util";
import Role from "../enums/roles";

@injectable()
export default class UserService {
    constructor(private readonly _userRepository: UserRepository) {
    }

    async getUser(username: string): Promise<LeanDocument<UserDocument> | null> {
        return this._userRepository.getUser(username);
    }

    async invalidAttempt(user: User) {
        if (user.loginAttempts < 3) {
            user.loginAttempts++;
        } else {
            if (process.env.LOCKOUT) {
                const now: number = Date.now();

                user.lockedUntil = new Date(now + parseInt(process.env.LOCKOUT) * 60 * 60 * 1000);
            } else {
                throw new Error("'LOCKOUT' environment variable is not set.");
            }
        }

        await this._userRepository.updateUser(user);
    }

    async login(username: string, password: string): Promise<string | null> {
        const user: LeanDocument<UserDocument> = await this._userRepository.getUser(username);

        if (user && await bcrypt.compare(password, user.password)) {
            /* istanbul ignore next */
            return generateJWT(user.role ?? Role.Anonymous);
        } else {
            return null;
        }
    }

    async register(username: string, password: string): Promise<LeanDocument<UserDocument> | null> {
        /* istanbul ignore else */
        if (process.env.SALT_ROUNDS) {
            password = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

            try {
                return await this._userRepository.createUser(username, password);
            } catch {
                /* istanbul ignore next */
                return null;
            }
        } else {
            throw new Error("'SALT_ROUNDS' environment variable is not set.");
        }
    }
}