import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

class CreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

class UpdateArtistDto extends PartialType(CreateArtistDto) {}

export { CreateArtistDto, UpdateArtistDto }
