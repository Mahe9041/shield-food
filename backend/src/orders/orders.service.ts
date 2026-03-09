import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  ORDERS,
  RESTAURANTS,
  MENU_ITEMS,
  PAYMENT_METHODS,
  Order,
  OrderItem,
  User,
} from '../data/seed';
import { validateCountryAccess } from '../common/guards/country.guard';
import { CreateOrderDto, PlaceOrderDto } from './orders.dto';

@Injectable()
export class OrdersService {
  findAll(user: User) {
    let orders: Order[];

    if (user.role === 'admin') {
      // Admin sees every order globally
      orders = ORDERS;
    } else if (user.role === 'manager') {
      // Manager sees all orders in their country
      orders = ORDERS.filter((o) => o.country === user.country);
    } else {
      // Member sees only their own orders
      orders = ORDERS.filter((o) => o.userId === user.id);
    }

    // Sort newest first
    const sorted = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { orders: sorted, total: sorted.length };
  }

  findOne(id: string, user: User) {
    const order = ORDERS.find((o) => o.id === id);
    if (!order) throw new NotFoundException('Order not found');

    // Member can only see their own order
    if (user.role === 'member' && order.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    // Manager can only see orders in their country
    if (user.role === 'manager' && order.country !== user.country) {
      throw new ForbiddenException('Access denied');
    }

    return { order };
  }

  create(dto: CreateOrderDto, user: User) {
    // Find the restaurant
    const restaurant = RESTAURANTS.find((r) => r.id === dto.restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // Country check — can't order from another country's restaurant
    validateCountryAccess(restaurant.country, user);

    // Build order items and calculate total
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of dto.items) {
      const menuItem = MENU_ITEMS.find((m) => m.id === item.itemId);
      if (!menuItem) {
        throw new BadRequestException(`Menu item ${item.itemId} not found`);
      }

      // Make sure item belongs to the restaurant being ordered from
      if (menuItem.restaurantId !== dto.restaurantId) {
        throw new BadRequestException(
          `Item ${item.itemId} does not belong to this restaurant`,
        );
      }

      orderItems.push({
        itemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });

      total += menuItem.price * item.quantity;
    }

    // Round to 2 decimal places to avoid floating point issues
    // Example: 12.99 + 6.99 might give 19.979999999 without this
    total = Math.round(total * 100) / 100;

    const newOrder: Order = {
      id: `order-${uuidv4()}`,
      userId: user.id,
      restaurantId: dto.restaurantId,
      country: restaurant.country,
      items: orderItems,
      total,
      status: 'pending',
      paymentMethodId: null,
      createdAt: new Date().toISOString(),
    };

    // Push to our in-memory array
    ORDERS.push(newOrder);

    return { order: newOrder, message: 'Order created successfully' };
  }

  place(id: string, dto: PlaceOrderDto, user: User) {
    const index = ORDERS.findIndex((o) => o.id === id);
    if (index === -1) throw new NotFoundException('Order not found');

    const order = ORDERS[index];

    // Country check for managers
    if (user.role === 'manager' && order.country !== user.country) {
      throw new ForbiddenException('Access denied');
    }

    // Can only place a pending order
    if (order.status !== 'pending') {
      throw new BadRequestException(
        `Cannot place an order with status: ${order.status}`,
      );
    }

    // Validate payment method exists
    const payMethod = PAYMENT_METHODS.find((p) => p.id === dto.paymentMethodId);
    if (!payMethod) throw new BadRequestException('Invalid payment method');

    // Update the order in-place using index
    ORDERS[index] = {
      ...order,
      paymentMethodId: dto.paymentMethodId,
      status: 'confirmed',
      placedAt: new Date().toISOString(),
    };

    return { order: ORDERS[index], message: 'Order placed successfully' };
  }

  cancel(id: string, user: User) {
    const index = ORDERS.findIndex((o) => o.id === id);
    if (index === -1) throw new NotFoundException('Order not found');

    const order = ORDERS[index];

    // Country check for managers
    if (user.role === 'manager' && order.country !== user.country) {
      throw new ForbiddenException('Access denied');
    }

    // Cannot cancel already cancelled or delivered orders
    if (['cancelled', 'delivered'].includes(order.status)) {
      throw new BadRequestException(
        `Cannot cancel an order with status: ${order.status}`,
      );
    }

    ORDERS[index] = {
      ...order,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
    };

    return { order: ORDERS[index], message: 'Order cancelled successfully' };
  }
}
