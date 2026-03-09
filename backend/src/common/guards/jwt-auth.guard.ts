import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// That's it — one line of logic
// AuthGuard('jwt') is a pre-built Passport guard
// It automatically reads the Bearer token from the Authorization header,
// verifies it using our JwtStrategy (we build that next),
// and attaches the user to request.user
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
