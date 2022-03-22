import {injectable} from "tsyringe";
import Controller from "./controller";
import UserService from "../services/user.service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {UserDocument} from "../models/user.model";
import {LeanDocument} from "mongoose";

@injectable()
export default class UserController extends Controller {
    constructor(private readonly _userService: UserService) {
        super();
    }

    private static validateUserDetails(req: Request<unknown, unknown, { username: string, password: string }>, res: Response, validCallback: () => void): void {
        if (req.body.username && req.body.password) {
            return validCallback();
        }

        if (!req.body.username && !req.body.password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                username: "Username is required.",
                password: "Password is required."
            });
        } else if (!req.body.username) {
            res.status(StatusCodes.BAD_REQUEST).json({
                username: "Username is required.",
                password: null
            });
        } else if (!req.body.password) {
            res.status(StatusCodes.BAD_REQUEST).json({
                username: null,
                password: "Password is required."
            });
        }
    }

    initializeRoutes(): void {
        this._router.get("/login", async (req: Request<unknown, unknown, { username: string, password: string }>, res: Response) => {
            UserController.validateUserDetails(req, res, async () => {
                const user: LeanDocument<UserDocument> | null = await this._userService.getUser(req.body.username);

                if (user) {
                    const token: string | null = await this._userService.login(req.body.username, req.body.password);

                    if (user.lockedUntil.getTime() < Date.now()) {
                        if (token) {
                            return res.cookie("auction-jwt", token, {secure: true, httpOnly: true});
                        } else {
                            await this._userService.invalidAttempt(user);

                            return res.status(StatusCodes.BAD_REQUEST).json({
                                username: null,
                                password: "Password is incorrect."
                            });
                        }
                    } else {
                        return res.status(StatusCodes.FORBIDDEN).send("Account is temporarily locked due to too many failed attempts.");
                    }
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        username: "User does not exist.",
                        password: null
                    });
                }
            });
        });

        this._router.post("/register", async (req: Request<unknown, unknown, { username: string, password: string }>, res: Response) => {
            UserController.validateUserDetails(req, res, async () => {
                const user: LeanDocument<UserDocument> | null = await this._userService.register(req.body.username, req.body.password);

                if (user) {
                    return res.json(user);
                } else {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        username: "Username already exists.",
                        password: null
                    });
                }
            });
        });
    }
}