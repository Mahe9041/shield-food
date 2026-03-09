import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto, AddPaymentDto } from './payments.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import {
  CurrentUser,
  RequirePermission,
} from '../common/decorators/decorators';

@Controller('payments')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // GET /api/payments — all roles (scoped in service)
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.paymentsService.findAll(user);
  }

  // POST /api/payments — admin only
  @Post()
  @RequirePermission('update_payment')
  add(@Body() dto: AddPaymentDto) {
    return this.paymentsService.add(dto);
  }

  // PUT /api/payments/:id — admin only
  @Put(':id')
  @RequirePermission('update_payment')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }
}
