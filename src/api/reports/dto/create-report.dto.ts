import { IsString, Matches, MinLength } from "class-validator";

export class CreateReportDto {

  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @Matches(
    /^[^/\s]+\/[^/\s]+\/[^/\s]+$/, {
      message: 'location must include faculty/building/classroom'
    }
  )
  location: string

}
