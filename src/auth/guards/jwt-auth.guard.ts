import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Unauthorized access - Invalid or missing token'
      });
    }
    return user;
  }
} 