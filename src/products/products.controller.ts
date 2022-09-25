import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Delete, Patch } from '@nestjs/common/decorators';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') productTitle: string,
    @Body('desc') productDesc: string,
    @Body('price') productPrice: number,
  ) {
    const generatedId = await this.productService.insertProduct(
      productTitle,
      productDesc,
      productPrice,
    );

    return { id: generatedId };
  }

  @Get()
  async getAllProducts() {
    const products = await this.productService.getProducts();
    return products;
  }

  @Get(':id')
  async getProduct(@Param('id') prodId: string) {
    const product = await this.productService.getProduct(prodId);
    return product;
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body('title') productTitle: string,
    @Body('desc') productDesc: string,
    @Body('price') productPrice: number,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      productId,
      productTitle,
      productDesc,
      productPrice,
    );
    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') productId: string) {
    const res = await this.productService.deleteProduct(productId);
    return res;
  }
}
