import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsInt, IsUUID, IsPositive, ValidateIf } from 'class-validator';

class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  year: number;

  @ValidateIf((_album, artistId) => artistId !== null)
  @IsString()
  @IsUUID()
  artistId: string | null;
}

class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export { CreateAlbumDto, UpdateAlbumDto }
