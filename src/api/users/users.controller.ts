import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto, UserPaginationDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from './decorators';
import { ValidRoles } from './enums/valid-roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserAccessGuard } from './guards/user-access.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('login')
  login(@Body() login: LoginUserDto){
    return this.usersService.login(login);
  }

  @Get()
  @Auth( ValidRoles.admin )
  findAll(@Query() userPaginationDto: UserPaginationDto) {
    return this.usersService.findAll(userPaginationDto);
  }

  @Get(':id')
  @UseGuards( AuthGuard(), UserAccessGuard )
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
