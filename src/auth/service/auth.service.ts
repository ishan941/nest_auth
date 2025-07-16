import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const userExists = await this.usersRepository.findOne({
            where: { email: registerDto.email },
        });
        if (userExists) {
            throw new ConflictException('User already exists')
        }
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = this.usersRepository.create({
            ...registerDto, password: hashedPassword
        });
        await this.usersRepository.save(user);
        return {
            statusCode: 201,
            message: "User Registered Successfully"
        };
    }


    async login(loginDto: LoginDto) {
        try {
            const user = await this.validateUser(loginDto.email, loginDto.password);
            const tokens = await this.generateTokens(user);
            return {
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,

                },
                ...tokens

            }


        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    private async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async refreshTokens(user: any) {
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.sub, tokens.refreshToken);
        return tokens;
    }

    private async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: user.id, email: user.email },
                { secret: 'your-access-token-secret', expiresIn: '15m' },
            ),
            this.jwtService.signAsync(
                { sub: user.id, email: user.email },
                { secret: 'your-refresh-token-secret', expiresIn: '7d' },
            ),
        ]);

        // Save refresh token
        await this.updateRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }
}
