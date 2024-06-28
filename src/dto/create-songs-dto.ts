import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsMilitaryTime,
  ArrayMinSize,
} from 'class-validator';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @ArrayMinSize(1)
  readonly artists: string[];

  @IsNotEmpty()
  @IsDateString()
  readonly releaseDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;
}
