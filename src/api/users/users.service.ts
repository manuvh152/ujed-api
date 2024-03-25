import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, LoginUserDto, UserPaginationDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {

  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}

  async register(createUserDto: CreateUserDto) {
    try {

      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwt({ id: user.id })
      };

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto){

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase().trim() },
      select: { email: true, password: true, id: true }
    });

    if( !user ){
      throw new UnauthorizedException('Credentials are not valid');
    }

    if( !bcrypt.compareSync( password, user.password ) ){
      throw new UnauthorizedException('Credentials are not valid');
    }
    
    return {
      id: user.id,
      token: this.getJwt({ id: user.id })
    }

  }

  findAll(userPaginationDto: UserPaginationDto) {    
    try {

      const { limit = 10, offset = 0, order, order_by } = userPaginationDto;

      const users = this.userRepository.find({
        take: limit,
        skip: offset,
        order: {
          [ order_by? order_by: 'created_at' ]: order ? order : 'asc'
        }
      });

      return users;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {

      const user = await this.userRepository.findOne({
        where: { id: id }
      });

      if( !user ) return new NotFoundException('User not found').getResponse();

      return user;

    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {

      return await this.userRepository.update( id ,{ ...updateUserDto })
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async remove(id: string) {
    try {

      return await this.userRepository.delete(id);
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  private getJwt( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
