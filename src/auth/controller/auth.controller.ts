import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(@Request() req) {
        return this.authService.refreshTokens(req.user);
    }
}