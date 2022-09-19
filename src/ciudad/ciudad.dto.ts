
import { IsNotEmpty,IsNumber, IsString, IsUrl} from 'class-validator';
import { isNumberObject } from 'util/types';

export class CiudadDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly pais: string;
    
    @IsNumber()
    @IsNotEmpty()
    readonly numHabitantes: Date;
    
   }