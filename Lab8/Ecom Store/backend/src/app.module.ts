
import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ProductsModule,
    AuthModule,
    CartModule,
  ],
})
export class AppModule {}
