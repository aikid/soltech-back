import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from './prisma/prisma.service'
import { UsersController } from './controllers/user.controller'
import { AuthController } from './controllers/auth.controller'
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envSchema } from './env'
import { UserService } from './services/user.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env =>envSchema.parse(env),
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
    HttpModule
  ],
  controllers: [UsersController, AuthController],
  providers: [PrismaService, AuthService, UserService],
})
export class AppModule {}
