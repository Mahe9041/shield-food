import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PAYMENT_METHODS } from '../data/seed';
import { UpdatePaymentDto, AddPaymentDto } from './payments.dto';

@Injectable()
export class PaymentsService {
  findAll(user: any) {
    // Admin sees all payment methods across all users
    // Everyone else sees only their own
    const methods =
      user.role === 'admin'
        ? PAYMENT_METHODS
        : PAYMENT_METHODS.filter((p) => p.userId === user.id);

    return { paymentMethods: methods };
  }

  update(id: string, dto: UpdatePaymentDto) {
    const index = PAYMENT_METHODS.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Payment method not found');

    PAYMENT_METHODS[index] = {
      ...PAYMENT_METHODS[index],
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    return {
      paymentMethod: PAYMENT_METHODS[index],
      message: 'Updated successfully',
    };
  }

  add(dto: AddPaymentDto) {
    const newMethod = {
      id: `pay-${uuidv4()}`,
      ...dto,
    };
    PAYMENT_METHODS.push(newMethod);
    return { paymentMethod: newMethod, message: 'Payment method added' };
  }
}
