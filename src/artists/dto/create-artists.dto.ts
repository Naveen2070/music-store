import { IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateArtistDTO {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  songIds?: number[];
}
