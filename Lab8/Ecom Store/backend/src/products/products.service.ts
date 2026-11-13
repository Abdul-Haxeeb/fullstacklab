
import { Injectable, NotFoundException } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

@Injectable()
export class ProductsService {
  private products: Product[] = [];
  private nextId = 1;

  getAllProducts() {
    return this.products;
  }

  addProduct(product: any) {
    const newProduct: Product = {
      id: this.nextId++,
      name: product.name,
      price: Number(product.price),
      category: product.category,
      image: product.image,
      description: product.description,
    };

    this.products.push(newProduct);

    return {
      message: 'Product added successfully',
      product: newProduct,
    };
  }

  deleteProduct(id: number) {
    const index = this.products.findIndex(
      (product) => product.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Product not found');
    }

    this.products.splice(index, 1);

    return {
      message: 'Product deleted successfully',
    };
  }
}
