import {
  IsString,
  IsDateString,
  IsMilitaryTime,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';

export class UpdateSongDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  readonly artists: string[];

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
