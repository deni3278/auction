import supertest, {SuperTest, Test} from "supertest";
import routes from "../routes";
import {connect, connection} from "mongoose";
import {Product, ProductModel} from "../models/product.model";
import {generateJWT} from "../utils/auth.util";
import Role from "../enums/roles";
import {StatusCodes} from "http-status-codes";

const request: SuperTest<Test> = supertest(routes);
const dbName = "auctionTestDB";

async function mock(): Promise<void> {
    await ProductModel.create({name: "Test Product"});
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

describe("GET /", () => {
    it("should return unauthorized", () => {
        return request.get("/api/products")
            .set("Cookie", [`auction-jwt=${generateJWT(Role.Anonymous)}`])
            .expect(StatusCodes.UNAUTHORIZED);
    });

    it("should return list of products", () => {
        return request.get("/api/products")
            .set("Cookie", [`auction-jwt=${generateJWT(Role.User)}`])
            .expect(StatusCodes.OK)
            .then(res => {
                expect(res.body.length).toBeGreaterThanOrEqual(0);
            });
    });
});

describe("GET /:name", () => {
    it("should return not found", () => {
        return request.get("/api/products/null")
            .set("Cookie", [`auction-jwt=${generateJWT(Role.User)}`])
            .expect(StatusCodes.NOT_FOUND);
    });

    it("should return product", () => {
        return request.get("/api/products/Test Product")
            .set("Cookie", [`auction-jwt=${generateJWT(Role.User)}`])
            .expect(StatusCodes.OK);
    });
});

describe("POST /", () => {
    it("should return bad request", () => {
        const product: Record<string, never> = {};

        return request.post("/api/products")
            .send(product)
            .set("Cookie", [`auction-jwt=${generateJWT(Role.User)}`])
            .expect(StatusCodes.BAD_REQUEST);
    });

    it("should return created product", () => {
        const product: Product = {
            name: "Create Product",
            price: 1,
            quantity: 1
        }

        return request.post("/api/products")
            .send(product)
            .set("Cookie", [`auction-jwt=${generateJWT(Role.User)}`])
            .expect(StatusCodes.OK);
    });
});