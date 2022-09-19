import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermercadoDto } from '../supermercado/supermercado.dto';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Controller('ciudad')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
   constructor(private readonly CiudadSupermercadoService: CiudadSupermercadoService){}

   @Post(':ciudadId/supermercados/:supermercadoId')
   async addAirportToAirline(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.CiudadSupermercadoService.addSupermarketToCity(ciudadId, supermercadoId);
   }
   @Get(':ciudadId/supermercados/:supermercadoId')
   async findAirportFromAirline(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.CiudadSupermercadoService.findSupermarketFromCity(ciudadId, supermercadoId);
   }

   @Get(':ciudadId/supermercados')
   async findsupermercadosByciudadId(@Param('ciudadId') ciudadId: string){
       return await this.CiudadSupermercadoService.findSupermarketsFromCity(ciudadId);
   }

   @Put(':ciudadId/supermercados')
   async updateAirportsFromAirline(@Body() supermercadosDto: SupermercadoDto[], @Param('ciudadId') ciudadId: string){
       const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
       return await this.CiudadSupermercadoService.updateSupermarketsFromCity(ciudadId, supermercados);
   }


   @Delete(':ciudadId/supermercados/:supermercadoId')
@HttpCode(204)
   async deleteAirportFromAirline(@Param('ciudadId') ciudadId: string, @Param('supermercadoId') supermercadoId: string){
       return await this.CiudadSupermercadoService.deleteSupermarketFromCity(ciudadId, supermercadoId);
   }

   
}