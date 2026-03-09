import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USERS } from '../data/seed';

// This secret must match what we use to SIGN the token
// In production this goes in an environment variable (.env file)
export const JWT_SECRET = process.env.JWT_SECRET || 'shield-secret-2024';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Tell Passport WHERE to find the token in the request
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // If token is expired, reject it
      ignoreExpiration: false,
      // The secret used to verify the token's signature
      secretOrKey: JWT_SECRET,
    });
  }

  // This method runs AFTER Passport verifies the token signature
  // The `payload` is what we put inside the token when we created it
  // We put { sub: userId, role } — sub is JWT standard for "subject" (the user)
  validate(payload: { sub: string; role: string }) {
    const user = USERS.find((u) => u.id === payload.sub);
    if (!user) throw new UnauthorizedException('User no longer exists');

    // We return everything EXCEPT the password
    // Whatever we return here gets attached to request.user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
