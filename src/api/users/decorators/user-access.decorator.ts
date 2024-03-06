import { UseGuards, applyDecorators } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ValidRoles } from "../enums/valid-roles.enum";
import { RoleProtected } from "./role-protected.decorator";
import { UserAccessGuard } from "../guards/user-access.guard";

export function UserAccess(...roles: ValidRoles[]){
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards( AuthGuard(), UserAccessGuard )
  )
}