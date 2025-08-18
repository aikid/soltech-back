import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma/prisma.service'
import { UsersController } from './controllers/user.controller'
import { envSchema } from './env'

@Module({
  imports: [ConfigModule.forRoot({
    validate: env =>envSchema.parse(env),
    isGlobal: true,
  })],
  controllers: [UsersController],
  providers: [PrismaService],
})
export class AppModule {}
