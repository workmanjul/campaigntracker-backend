import { PaginationService } from 'src/pagination/pagination.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import crypto from 'crypto';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly paginationService: PaginationService<User>,
    private prisma: PrismaService,
  ) {}

  // CREATE (POST) - Create a new user
  // Parameters:UserData: (name,email,password) in Object Form

  async create(dto: CreateUserDto): Promise<{ message: string; user: User }> {
    // check uniqueness of username/email

    const { name, email, password } = dto;

    const existUser = await this.prisma.user.findUnique({ where: { email } });
    if (existUser) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { email: 'Email is already taken' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = crypto.createHmac('sha256', password).digest('hex');

    const user = await this.prisma.user.create({
      data: { name: name, email: email, password: hashedPassword },
    });
    return {
      message: 'User created successfully',
      user: user,
    };
  }

  // READ (GET) - find user by email
  // Parameters: userEmail: The email of the user

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  // Get All Users

  async findAllUsers(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginationResponse<User>> {
    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const users = await this.prisma.user.findMany({
      skip,
      take,
    });

    const totalItems = await this.prisma.user.count(); // Count total number of items

    return this.paginationService.getPaginationData(
      page,
      pageSize,
      users,
      totalItems,
    );
  }

  // READ (GET) - Get user details by ID
  // Parameters:
  // - userId: The ID of the user to fetch
  // Returns: Single user instance

  async findUser(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // UPDATE (PUT) - Update user details by ID
  // Parameters:
  // - userId: The ID of the user to update
  // - updatedUserData: An object containing the updated user data

  async updateUser(
    id: number,
    userData: CreateUserDto,
  ): Promise<{ message: string; data: User }> {
    const entityToUpdate = await this.prisma.user.findUnique({ where: { id } });
    if (!entityToUpdate) {
      throw new HttpException(
        {
          message: 'User Account not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    // Update all properties at once

    const user = await this.prisma.user.update({
      where: { id },
      data: userData,
    });
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  // DELETE (DELETE) - Delete user by ID
  // Parameters:
  // - userId: The ID of the user to delete

  async deleteUser(id: number): Promise<{ message: string }> {
    const existUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existUser) {
      throw new HttpException(
        {
          message: 'Input Request',
          errors: { email: 'User not found' },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prisma.user.delete({ where: { id } });
    return { message: 'user deleted successfully' };
  }
}
