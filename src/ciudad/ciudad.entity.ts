import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

@Entity()
export class CiudadEntity {
    
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
nombre: string;

@Column()
pais: string;

@Column()
numHabitantes: number;

@ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
 @JoinTable()
 supermercados: SupermercadoEntity[];
}
