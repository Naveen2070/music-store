import {
  IsString,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Artist } from 'src/artists/entity/artist.entity';

export class UpdateSongDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  readonly artists: Artist[];

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
