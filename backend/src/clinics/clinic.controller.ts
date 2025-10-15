import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ClinicService } from './clinic.service';

@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicsService: ClinicService) {}

  @Get()
  findAll() {
    return this.clinicsService.findAll();
  }

  @Post()
  create(@Body('name') name: string) {
    return this.clinicsService.create(name);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.clinicsService.remove(id);
  }
}
