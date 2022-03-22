import {injectable} from "tsyringe";
import ProductRepository from "../repositories/product.repository";
import {Product, ProductDocument} from "../models/product.model";
import {LeanDocument} from "mongoose";

@injectable()
export default class ProductService {
    constructor(private readonly _productRepository: ProductRepository) {
    }

    async getAll(): Promise<LeanDocument<ProductDocument>[]> {
        return await this._productRepository.getAll();
    }

    async getProduct(name: string): Promise<LeanDocument<ProductDocument> | null> {
        return await this._productRepository.getProduct(name);
    }

    async createProduct(product: Product): Promise<LeanDocument<ProductDocument> | null> {
        return await this._productRepository.createProduct(product);
    }
}