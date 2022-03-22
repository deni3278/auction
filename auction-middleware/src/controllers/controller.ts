import {Router} from "express";

export default abstract class Controller {
    protected readonly _router: Router;

    protected constructor() {
        this._router = Router();
    }

    abstract initializeRoutes(): void;

    routes(): Router {
        this.initializeRoutes();

        return this._router;
    }
}