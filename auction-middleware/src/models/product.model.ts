import {Schema, Model, model} from "mongoose";

export interface Product {
    name: string,
    price: number,
    quantity: number
}

export interface ProductDocument extends Product {
    createdAt: Date,
    updatedAt: Date
}

const productSchema: Schema<ProductDocument> = new Schema<ProductDocument>({
        name: {type: String, required: true, unique: true},
        price: {type: Number, required: true, default: 0},
        quantity: {type: Number, required: true, default: 0}
    },
    {
        timestamps: true
    });

export const ProductModel: Model<ProductDocument> = model<ProductDocument>("Product", productSchema);