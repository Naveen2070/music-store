import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateArtistDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  songIds?: number[];
}
