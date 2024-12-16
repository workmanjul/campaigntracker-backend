import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

//@UseGuards(AuthGuard('jwt'))
//TODO Not working as expected
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Get()
  async findUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    const resp = await this.userService.findAllUsers(page, pageSize);
    return resp;
  }

  @Get(':id')
  async findAdAccount(@Param('id') id: number) {
    return this.userService.findUser(+id);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  @Put(':id')
  async updateuser(@Body() userData: CreateUserDto, @Param('id') id: string) {
    return this.userService.updateUser(+id, userData);
  }
}
