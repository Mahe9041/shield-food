import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/decorators';
import type { User } from 'src/data/seed';

// @Controller('auth') means all routes in this class start with /auth
// Combined with our global prefix /api → routes become /api/auth/...
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/login
  // No guards here — this is the public endpoint everyone can access
  @Post('login')
  login(@Body() dto: LoginDto) {
    // @Body() extracts the request body and maps it to LoginDto
    // ValidationPipe validates it before this line even runs
    return this.authService.login(dto);
  }

  // GET /api/auth/me
  // Protected — must have valid JWT token
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    // @CurrentUser() is our custom decorator from Step 12
    // It extracts user from request.user (put there by JwtAuthGuard)
    return this.authService.getMe(user);
  }
}
