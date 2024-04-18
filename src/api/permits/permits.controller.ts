import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PermitsService } from './permits.service';
import { CreatePermitDto } from './dto/create-permit.dto';
import { UpdatePermitDto } from './dto/update-permit.dto';
import { Auth, GetUser } from '../users/decorators';
import { ValidRoles } from '../users/enums/valid-roles.enum';
import { User } from '../users/entities/user.entity';
import { PermitPaginationDto } from './dto';

@Controller('permits')
export class PermitsController {
  constructor(private readonly permitsService: PermitsService) {}

  @Post()
  @Auth( ValidRoles.admin )
  create(
    @Body() createPermitDto: CreatePermitDto,
    @GetUser() user: User
  ) {
    return this.permitsService.create(createPermitDto, user);
  }

  @Get()
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findAll(
    @Query() pagination: PermitPaginationDto
  ) {
    return this.permitsService.findAll(pagination);
  }

  @Get(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  findOne(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.permitsService.findOne(id);
  }

  @Patch(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePermitDto: UpdatePermitDto) {
    return this.permitsService.update(id, updatePermitDto);
  }

  @Delete(':id')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  remove(@Param('id') id: string) {
    return this.permitsService.remove(id);
  }

  @Delete(':id/file')
  @Auth( ValidRoles.admin, ValidRoles.superUser )
  DeleteFile(
    @Param('id', ParseUUIDPipe) id: string
  ){
    return this.permitsService.deleteFilePermit(id);
  }

}
