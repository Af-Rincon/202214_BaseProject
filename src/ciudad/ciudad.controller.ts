import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly CiudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.CiudadService.findAll();
  }

  @Get(':ciudadId')
  async findOne(@Param('ciudadId') ciudadId: string) {
    return await this.CiudadService.findOne(ciudadId);
  }

  @Post()
  async create(@Body() CiudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, CiudadDto);
    return await this.CiudadService.create(ciudad);
  }

  @Put(':ciudadId')
  async update(@Param('ciudadId') ciudadId: string, @Body() CiudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, CiudadDto);
    return await this.CiudadService.update(ciudadId, ciudad);
  }

  @Delete(':ciudadId')
  @HttpCode(204)
  async delete(@Param('ciudadId') ciudadId: string) {
    return await this.CiudadService.delete(ciudadId);
  }
}