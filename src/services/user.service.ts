import { Injectable, UnauthorizedException, HttpException, ConflictException  } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserBodySchema, createUserBodySchema } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserBodySchema) {
    const { password, confirmPassword, ...rest } = data;

    const userExists = await this.prisma.user.findFirst({
      where: {
        OR: [
          { cpf: rest.cpf },
          { email: rest.email },
        ],
      },
    });

    if (userExists) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: passwordHash,
      },
    });

    // Remove password do retorno
    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
