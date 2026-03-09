import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [AuthModule, RestaurantsModule, OrdersModule, PaymentsModule],
  // We removed AppController and AppService
  // They were just the Hello World example — we don't need them
  controllers: [],
  providers: [],
})
export class AppModule {}
