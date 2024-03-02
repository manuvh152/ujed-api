import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

const validDomains = ['ujed.mx']

export class LoginUserDto{

  @IsString()
  @IsEmail({
    host_whitelist: validDomains,
  }, {
    message: `email must match an accepted domain, use an email address from [${validDomains}]`
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password must have an uppercase, lowercase letter and a number'
  })
  password: string;

}