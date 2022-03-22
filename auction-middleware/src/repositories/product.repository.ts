import {LeanDocument} from "mongoose";
import {ProductDocument, ProductModel, Product} from "../models/product.model";

export default class ProductRepository {
    async getAll(): Promise<LeanDocument<ProductDocument>[]> {
        return ProductModel
            .find()
            .lean();
    }

    async getProduct(name: string): Promise<LeanDocument<ProductDocument> | null> {
        return ProductModel
            .findOne({name: name})
            .lean();
    }

    async createProduct(input: Product): Promise<LeanDocument<ProductDocument> | null> {
        try {
            return (await (await ProductModel
                .create(input))
                .save())
                .toObject();
        } catch {
            return null;
        }
    }
}