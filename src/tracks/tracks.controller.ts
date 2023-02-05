import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { CreateTrackDto, UpdateTrackDto } from './tracks.dto';
import { Track } from './tracks.interface';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService
  ) {}

  @Get()
  async findAll(): Promise<Track[]> {
    return await this.tracksService.findAll();
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.tracksService.findByID(id);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.tracksService.create(createTrackDto);
  }

  @Put(':uuid')
  @Header('Content-Type', 'application/json')
  async update(@Param('uuid', new ParseUUIDPipe()) id: string, @Body() updateTrackDto: UpdateTrackDto) {
    return await this.tracksService.updateByID(id, updateTrackDto);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('uuid', new ParseUUIDPipe()) id: string) {
    return await this.tracksService.deleteByID(id);
  }
}
