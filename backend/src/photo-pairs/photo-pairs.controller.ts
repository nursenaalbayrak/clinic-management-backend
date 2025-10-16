import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { PhotoPairsService } from './photo-pairs.service';
import { CreatePhotoPairDto } from './dto/create-photo-pair.dto';
import { UpdatePhotoPairDto } from './dto/update-photo-pair.dto';

@ApiTags('PhotoPairs')
@Controller('photo-pairs')
export class PhotoPairsController {
  constructor(private readonly service: PhotoPairsService) {}

  @Post()
  @ApiBody({ type: CreatePhotoPairDto })
  create(@Body() dto: CreatePhotoPairDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.service.get(id);
  }

  @Get('patient/:patientId')
  listByPatient(@Param('patientId') patientId: number) {
    return this.service.listByPatient(patientId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePhotoPairDto })
  update(@Param('id') id: number, @Body() dto: UpdatePhotoPairDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
