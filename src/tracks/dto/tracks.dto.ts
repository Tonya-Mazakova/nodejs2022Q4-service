import { IsString, IsNotEmpty, IsInt, IsUUID, ValidateIf } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((_album, artistId) => artistId !== null)
  @IsString()
  @IsUUID()
  artistId: string | null;

  @ValidateIf((_album, albumId) => albumId !== null)
  @IsString()
  @IsUUID()
  albumId: string | null;

  @IsInt()
  duration: number;
}

class UpdateTrackDto extends PartialType(CreateTrackDto) {}

export { CreateTrackDto, UpdateTrackDto }
