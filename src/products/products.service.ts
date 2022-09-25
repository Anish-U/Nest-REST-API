import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModule: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModule({
      title,
      description: desc,
      price,
    });

    const res = await newProduct.save();
    return res.id as string;
  }

  async getProducts() {
    const products = await this.productModule.find().exec();
    return products.map((prod) => ({
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    }));
  }

  private async findProduct(id: string) {
    let product;

    try {
      product = await this.productModule.findById(id);
    } catch (err) {
      throw new NotFoundException('Could not find product.');
    }

    if (!product) {
      throw new NotFoundException('Could not find product.');
    }

    return product;
  }

  async getProduct(id: string) {
    const product = await this.findProduct(id);
    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async updateProduct(id: string, title: string, desc: string, price: number) {
    const product = await this.findProduct(id);

    if (title) product.title = title;
    if (desc) product.description = desc;
    if (price) product.price = price;

    await product.save();

    return {
      id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
    };
  }

  async deleteProduct(id: string) {
    await this.findProduct(id);
    const res = await this.productModule.deleteOne({ _id: id }).exec();
    return {
      message: 'Product Deleted Successfully',
    };
  }
}
