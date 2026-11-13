
import { Injectable, NotFoundException } from '@nestjs/common';

interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
}

@Injectable()
export class CartService {
  private cartItems: CartItem[] = [];
  private nextId = 1;

  getCart() {
    const total = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      items: this.cartItems,
      total: total,
    };
  }

  addToCart(item: any) {
    const newItem: CartItem = {
      id: this.nextId++,
      productName: item.productName,
      price: Number(item.price),
      quantity: Number(item.quantity),
    };

    this.cartItems.push(newItem);

    return {
      message: 'Item added to cart',
      item: newItem,
    };
  }

  removeFromCart(id: number) {
    const index = this.cartItems.findIndex(
      (item) => item.id === id,
    );

    if (index === -1) {
      throw new NotFoundException('Cart item not found');
    }

    this.cartItems.splice(index, 1);

    return {
      message: 'Item removed from cart',
    };
  }
}
