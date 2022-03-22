import {NextFunction, Request, Response} from "express";
import Role from "../enums/roles";
import jwt, {JwtPayload} from "jsonwebtoken";
import {StatusCodes} from "http-status-codes";

export function authentication(minRole: Role) {
    return function (req: Request, res: Response, next: NextFunction) {
        const token: string = req.cookies["auction-jwt"];

        /* istanbul ignore else */
        if (process.env.SECRET_KEY) {
            jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
                /* istanbul ignore else */
                if (decoded) {
                    const role: Role = (decoded as JwtPayload).role;

                    if (role < minRole) {
                        return res.sendStatus(StatusCodes.UNAUTHORIZED);
                    } else {
                        next();
                    }
                } else {
                    console.log("Couldn't verify JWT:");
                    console.log(err);

                    return res.sendStatus(StatusCodes.UNAUTHORIZED);
                }
            });
        } else {
            throw new Error("'SECRET_KEY' environment variable is not set.");
        }
    }
}