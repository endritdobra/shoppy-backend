import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '../../generated/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserRequest): Promise<{ email: string }> {
    try {
      const hashedPass = await bcrypt.hash(data.password, 10);
      return await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashedPass,
        },
        select: {
          id: true,
          email: true,
        },
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Email alredy exists');
      }
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUniqueOrThrow({
      where: filter,
    });
  }
}
