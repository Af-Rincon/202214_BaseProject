import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utils/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadoList: SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiudadSupermercadoService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    supermercadoRepository.clear();
    ciudadRepository.clear();

    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.word(11),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        paginaWeb: faker.internet.url(),
        });
      supermercadoList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      pais: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      nombre: faker.address.country(),
      numHabitantes: faker.datatype.number(),
      supermercados: supermercadoList,
  });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermercadoCiudad should add an supermarket to a city', async () => {
    const supermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.word(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      pais: faker.helpers.arrayElement(['Argentina', 'Ecuador', 'Paraguay']),
      nombre: faker.address.country(),
      numHabitantes: faker.datatype.number(),
  });

    const result: CiudadEntity = await service.addSupermarketToCity(
      newCiudad.id,
      supermercado.id,
    );

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(supermercado.nombre);
    expect(result.supermercados[0].longitud).toBe(supermercado.longitud);
    expect(result.supermercados[0].latitud).toBe(supermercado.latitud);
    expect(result.supermercados[0].paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const ciudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.words(2),
      pais: faker.address.country(),
      numHabitantes: faker.datatype.number(),
      supermercados:[]
  });

    await expect(() =>
      service.addSupermarketToCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('addSupermarketToCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.word(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    });

    await expect(() =>
      service.addSupermarketToCity('0', newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    const storedSupermercado: SupermercadoEntity =
      await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.paginaWeb).toBe(supermercado.paginaWeb);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });

  it('findSupermarketFromCity should throw an exception for an supermarket not associated to the city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.word(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []

    });

    await expect(() =>
      service.findSupermarketFromCity(ciudad.id, newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });

  it('findSupermarketsFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity[] = await service.findSupermarketsFromCity(
      ciudad.id,
    );
    expect(supermercado.length).toBe(5);
  });
  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('updateSupermarketsFromCity should update supermercado list for a ccity', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
     nombre: faker.lorem.words(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []

    });

    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [
      newSupermercado,
    ]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].paginaWeb).toBe(newSupermercado.paginaWeb);
    expect(updatedCiudad.supermercados[0].ciudades).toBe(newSupermercado.ciudades);

  });

  it('updateSupermarketsFromCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.words(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    });

    await expect(() =>
      service.updateSupermarketsFromCity('0', [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('updateSupermarketsFromCity should throw an exception for an invalid supermarket', async () => {
    const newSupermercado: SupermercadoEntity = supermercadoList[0];
    newSupermercado.id = '0';

    await expect(() =>
      service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('deleteSupermarketFromCity should remove an supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({
      where: { id: ciudad.id },
      relations: ['supermercados'],
    });
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(
      (a) => a.id === supermercado.id,
    );

    expect(deletedSupermercado).toBeUndefined();
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });
  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The city with the given id was not found',
    );
  });
  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermarket', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.words(),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []

    });

    await expect(() =>
      service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id is not associated to the city',
    );
  });
});
