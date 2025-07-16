import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'ishan!1',
    database: 'shared_db',
    autoLoadEntities: true,
    synchronize: true,
  }), AuthModule,
  ],

})
export class AppModule { }
