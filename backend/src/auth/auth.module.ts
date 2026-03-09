import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy, JWT_SECRET } from './jwt.strategy';

@Module({
  imports: [
    // PassportModule enables Passport integration in NestJS
    PassportModule,

    // JwtModule.register() configures the JWT service globally for this module
    // secret = the key used to SIGN tokens (must match JwtStrategy's secretOrKey)
    // expiresIn = token becomes invalid after 24 hours
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  // providers = services and strategies NestJS should instantiate
  providers: [AuthService, JwtStrategy],
  // exports = makes JwtModule available to other modules that import AuthModule
  exports: [JwtModule],
})
export class AuthModule {}
