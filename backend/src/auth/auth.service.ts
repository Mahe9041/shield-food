import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USERS, PAYMENT_METHODS, User } from '../data/seed';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  // JwtService is injected by NestJS — we don't create it manually
  // This is Dependency Injection — a core NestJS concept
  constructor(private jwtService: JwtService) {}

  async login(dto: LoginDto) {
    // Step 1: Find user by email
    const user = USERS.find((u) => u.email === dto.email);

    // We give the same error whether email or password is wrong
    // Why? Security — we don't want to tell attackers "that email exists"
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // Step 2: Compare plain text password against the stored hash
    // bcrypt.compare handles this — you never decrypt a hash, you re-hash and compare
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    // Step 3: Create the JWT token
    // sub = subject (the user's ID) — this is JWT standard naming
    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Step 4: Find their payment method
    const paymentMethod =
      PAYMENT_METHODS.find((p) => p.userId === user.id) || null;

    // Step 5: Return token + user info (without password)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return {
      token,
      user: { ...userWithoutPassword, paymentMethod },
    };
  }

  getMe(user: User) {
    // user is already attached to request by JwtAuthGuard
    // We just enrich it with payment method and return
    const paymentMethod =
      PAYMENT_METHODS.find((p) => p.userId === user.id) || null;
    return { ...user, paymentMethod };
  }
}
