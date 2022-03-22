import supertest, {SuperTest, Test} from "supertest";
import routes from "../routes";
import {User, UserModel} from "../models/user.model";
import {connect, connection} from "mongoose";
import bcrypt from "bcrypt";
import {StatusCodes} from "http-status-codes";
import Role from "../enums/roles";

const request: SuperTest<Test> = supertest(routes);
const dbName = "auctionTestDB";

async function mock(): Promise<void> {
    if (process.env.SALT_ROUNDS) {
        await UserModel.create({
            username: "username",
            password: await bcrypt.hash("password", Number(process.env.SALT_ROUNDS))
        });
    } else {
        throw new Error("'SALT_ROUNDS' environment variable is not set.");
    }
}

beforeAll(async () => {
    if (process.env.DB) {
        try {
            await connect(process.env.DB, {dbName: dbName});
            await mock();
        } catch (err) {
            console.error(err);
        }
    } else {
        throw new Error("'DB' environment variable is not set.");
    }
});

afterAll(async () => {
    try {
        await connection.dropDatabase();
        await connection.close();
    } catch (err) {
        console.error(err);
    }
});

describe("GET /login", () => {
    it("should return unauthorized", async () => {
        return request.get("/api/users/login")
            .send({
                username: "null",
                password: "null"
            })
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it("should set JWT cookie", async () => {
        return request.get("/api/users/login")
            .send({
                username: "username",
                password: "password"
            })
            .expect(StatusCodes.OK)
            .then(res => {
                expect(res.headers["set-cookie"].filter((value: string) => value.includes("auction-jwt")).length).toBe(1);
            });
    });

    it("should set anonymous JWT cookie", async () => {
        return request.get("/api/users/login")
            .send({
                username: "username",
                password: "password"
            })
            .expect(StatusCodes.OK)
            .then(res => {
                expect(res.headers["set-cookie"].filter((value: string) => value.includes("auction-jwt")).length).toBe(1);
            });
    });
});

describe("POST /register", () => {
    it("should return bad request", () => {
        const user: Record<string, unknown> = {};

        return request
            .post("/api/users/register")
            .send(user)
            .expect(StatusCodes.BAD_REQUEST);
    });

    it("should return created user", () => {
        const user: User = {
            username: "test",
            password: "test",
            role: Role.User
        }

        return request
            .post("/api/users/register")
            .send(user)
            .expect(StatusCodes.OK);
    });
});