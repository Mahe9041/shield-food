import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, PlaceOrderDto } from './orders.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import {
  CurrentUser,
  RequirePermission,
} from '../common/decorators/decorators';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // GET /api/orders — all roles can view (no @RequirePermission needed)
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.ordersService.findAll(user);
  }

  // GET /api/orders/:id
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.findOne(id, user);
  }

  // POST /api/orders — all roles can create
  @Post()
  @RequirePermission('create_order')
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: any) {
    return this.ordersService.create(dto, user);
  }

  // POST /api/orders/:id/place — admin and manager only
  @Post(':id/place')
  @RequirePermission('place_order')
  place(
    @Param('id') id: string,
    @Body() dto: PlaceOrderDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.place(id, dto, user);
  }

  // POST /api/orders/:id/cancel — admin and manager only
  @Post(':id/cancel')
  @RequirePermission('cancel_order')
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.cancel(id, user);
  }
}
