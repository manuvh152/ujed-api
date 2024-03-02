import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";

@Injectable()
export class UserAccessGuard implements CanActivate{
  
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const req = context.switchToHttp().getRequest();
    const requestedUserId = req.params.id;
    const user = req.user as User;
    
    if( !user ){
      throw new BadRequestException('User not found');
    }

    if( requestedUserId === user.id ){
      return true;
    }

    if( user.roles.includes('admin') ){
      return true;
    }

    throw new ForbiddenException();

  }
}