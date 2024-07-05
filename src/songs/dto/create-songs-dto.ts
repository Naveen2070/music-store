import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Artist } from 'src/artists/entity/artist.entity';

export class CreateSongDTO {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  readonly artists: Artist[];

  @IsNotEmpty()
  @IsDateString()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsNotEmpty()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
