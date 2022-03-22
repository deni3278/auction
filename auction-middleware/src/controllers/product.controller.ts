import {injectable} from "tsyringe";
import Controller from "./controller";
import ProductService from "../services/product.service";
import {Request, Response} from "express";
import {Product, ProductDocument} from "../models/product.model";
import {StatusCodes} from "http-status-codes";
import {LeanDocument} from "mongoose";

@injectable()
export default class ProductController extends Controller {
    constructor(private readonly _productService: ProductService) {
        super();
    }

    initializeRoutes() {
        this._router.get("/", async (req: Request, res: Response) => {
            res.json(await this._productService.getAll());
        });

        this._router.get("/:name", async (req: Request<{ name: string }>, res: Response) => {
            const product: LeanDocument<ProductDocument> | null = await this._productService.getProduct(req.params.name);

            if (product) {
                res.json(product);
            } else {
                res.sendStatus(StatusCodes.NOT_FOUND)
            }
        });

        this._router.post("/", async (req: Request<unknown, unknown, Product>, res: Response) => {
            const product: LeanDocument<ProductDocument> | null = await this._productService.createProduct(req.body);

            if (product) {
                res.json(product);
            } else {
                res.sendStatus(StatusCodes.BAD_REQUEST);
            }
        });
    }
}