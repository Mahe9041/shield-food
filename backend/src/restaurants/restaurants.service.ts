import { Injectable, NotFoundException } from '@nestjs/common';
import { RESTAURANTS, MENU_ITEMS } from '../data/seed';
import { validateCountryAccess } from '../common/guards/country.guard';

@Injectable()
export class RestaurantsService {
  findAll(user: any) {
    // Admin sees everything, others see only their country
    // This is the country-scoped access (bonus feature)
    const restaurants =
      user.role === 'admin'
        ? RESTAURANTS
        : RESTAURANTS.filter((r) => r.country === user.country);

    return { restaurants, total: restaurants.length };
  }

  findOne(id: string, user: any) {
    const restaurant = RESTAURANTS.find((r) => r.id === id);

    // 404 if restaurant doesn't exist
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    // 403 if user tries to access another country's restaurant
    validateCountryAccess(restaurant.country, user);

    // Get menu items belonging to this restaurant
    const menu = MENU_ITEMS.filter((m) => m.restaurantId === id);

    return { restaurant, menu };
  }

  findMenu(restaurantId: string, user: any) {
    const restaurant = RESTAURANTS.find((r) => r.id === restaurantId);
    if (!restaurant) throw new NotFoundException('Restaurant not found');

    validateCountryAccess(restaurant.country, user);

    const items = MENU_ITEMS.filter((m) => m.restaurantId === restaurantId);
    return { items, total: items.length };
  }
}
