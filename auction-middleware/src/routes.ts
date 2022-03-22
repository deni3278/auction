import express, {Router} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {container} from "tsyringe";
import UserController from "./controllers/user.controller";
import ProductController from "./controllers/product.controller";
import Role from "./enums/roles";
import {authentication} from "./middlewares/auth.middleware";

const userRouter: Router = container.resolve(UserController).routes();
const productRouter: Router = container.resolve(ProductController).routes();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/products", authentication(Role.User), productRouter);

export default app;