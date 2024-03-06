import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, LoginUserDto, UserPaginationDto } from './dto';
import { Auth, UserAccess } from './decorators';
import { ValidRoles } from './enums/valid-roles.enum';

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
  @UserAccess( ValidRoles.admin )
  findOne(
    @Param('id') id: string
  ) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @UserAccess()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UserAccess()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
