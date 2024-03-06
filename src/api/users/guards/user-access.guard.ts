import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "../entities/user.entity";
import { Reflector } from "@nestjs/core";
import { META_ROLES } from "../decorators/role-protected.decorator";

@Injectable()
export class UserAccessGuard implements CanActivate{

  constructor(
    private readonly reflector: Reflector
  ){}
  
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    const req = context.switchToHttp().getRequest();
    const requestedUserId = req.params.id;
    const user = req.user as User;
    
    if( !user ){
      throw new BadRequestException('User not found');
    }

    if( requestedUserId === user.id ){
      return true;
    }

    if( validRoles ){
      for(const role of user.roles){
        if( validRoles.includes(role) ){
          return true;
        }
      }
    } 

    throw new ForbiddenException();

  }
}