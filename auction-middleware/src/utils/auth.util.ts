import Role from "../enums/roles";
import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        role: Role;
    }
}

export function generateJWT(role: Role): string {
    /* istanbul ignore else */
    if (process.env.SECRET_KEY && process.env.EXPIRES_IN) {
        return jwt.sign({role: role}, process.env.SECRET_KEY, {expiresIn: process.env.EXPIRES_IN});
    } else {
        throw new Error("'SECRET_KEY' or 'EXPIRES_IN' environment variable is not set.");
    }
}