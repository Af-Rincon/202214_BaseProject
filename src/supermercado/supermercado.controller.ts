import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { SupermercadoDto } from './supermercado.dto';
import { SupermercadoEntity } from './supermercado.entity';
import { SupermercadoService } from './supermercado.service';

@Controller('supermercados')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermercadoController {
    constructor(private readonly SupermercadoService: SupermercadoService) {}

  @Get()
  async findAll() {
    return await this.SupermercadoService.findAll();
  }

  @Get(':supermercadoId')
  async findOne(@Param('supermercadoId') supermercadoId: string) {
    return await this.SupermercadoService.findOne(supermercadoId);
  }

  @Post()
  async create(@Body() SupermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, SupermercadoDto);
    return await this.SupermercadoService.create(supermercado);
  }

  @Put(':supermercadoId')
  async update(@Param('supermercadoId') supermercadoId: string, @Body() SupermercadoDto: SupermercadoDto) {
    const supermercado: SupermercadoEntity = plainToInstance(SupermercadoEntity, SupermercadoDto);
    return await this.SupermercadoService.update(supermercadoId, supermercado);
  }

  @Delete(':supermercadoId')
  @HttpCode(204)
  async delete(@Param('supermercadoId') supermercadoId: string) {
    return await this.SupermercadoService.delete(supermercadoId);
  }
}