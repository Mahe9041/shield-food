import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import {
  CurrentUser,
  RequirePermission,
} from '../common/decorators/decorators';

// Both guards apply to ALL routes in this controller
// Order matters — JwtAuthGuard runs first (who are you?)
// then PermissionGuard (are you allowed?)
@Controller('restaurants')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  // GET /api/restaurants
  @Get()
  @RequirePermission('view_restaurants')
  findAll(@CurrentUser() user: any) {
    return this.restaurantsService.findAll(user);
  }

  // GET /api/restaurants/:id
  // :id is a URL parameter — /api/restaurants/rest-1
  @Get(':id')
  @RequirePermission('view_restaurants')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.restaurantsService.findOne(id, user);
  }

  // GET /api/restaurants/:restaurantId/menu
  @Get(':restaurantId/menu')
  @RequirePermission('view_restaurants')
  findMenu(
    @Param('restaurantId') restaurantId: string,
    @CurrentUser() user: any,
  ) {
    return this.restaurantsService.findMenu(restaurantId, user);
  }
}
