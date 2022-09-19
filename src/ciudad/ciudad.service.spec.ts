import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { CiudadEntity} from './ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/utils/testing-utils/typeorm-testing-config';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let ciudadList: CiudadEntity[];

  const seedDatabase = async () => {
    repository.clear();
    ciudadList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await repository.save({
        nombre: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
        pais: faker.address.country(),
        numHabitantes: faker.datatype.number(),
        supermercados:[]
     
      });
      ciudadList.push(ciudad);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all cities', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(ciudadList.length);
  });

  it('findOne should return a city by id', async () => {
    const storedCiudad: CiudadEntity = ciudadList[0];
    const ciudad: CiudadEntity = await service.findOne(storedCiudad.id);
    expect(ciudad).not.toBeNull();
    expect(ciudad.nombre).toEqual(storedCiudad.nombre);
  });

  it('create should return a new city', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      pais: faker.address.country(),
      numHabitantes: faker.datatype.number(),
      supermercados:[]
    };
  
    const newCiudad: CiudadEntity = await service.create(ciudad);
    expect(newCiudad).not.toBeNull();

    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: newCiudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(newCiudad.nombre);
  });

  it('create should not return a new city with wrong name', async () => {
    const ciudad: CiudadEntity = {
      id: '',
      nombre: faker.helpers.fake('Colombia'),
      pais: faker.address.country(),
      numHabitantes: faker.datatype.number(),
      supermercados:[]
    };
    await expect(() => service.create(ciudad)).rejects.toHaveProperty(
      'message',
      'The city name is not valid',
    );

  });



  it('update should modify a city}', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    ciudad.nombre = 'New name';
    const updatedCiudad: CiudadEntity = await service.update(ciudad.id, ciudad);
    expect(updatedCiudad).not.toBeNull();
    const storedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toEqual(ciudad.nombre);
  });

  it('update should throw an exception for an invalid city', async () => {
    let ciudad: CiudadEntity = ciudadList[0];
    ciudad = {
      ...ciudad,
      nombre: 'New name',
    };
    await expect(() => service.update('0', ciudad)).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('delete should remove a city', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    const deletedCiudad: CiudadEntity = await repository.findOne({
      where: { id: ciudad.id },
    });
    expect(deletedCiudad).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    await service.delete(ciudad.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

});
