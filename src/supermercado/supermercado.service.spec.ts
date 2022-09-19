import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoService } from './supermercado.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { SupermercadoEntity} from './supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/utils/testing-utils/typeorm-testing-config';

describe('SupermercadoService', () => {
  let service: SupermercadoService;
  let repository: Repository<SupermercadoEntity>;
  let supermercadoList: SupermercadoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    supermercadoList = [];
    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await repository.save({
        nombre: faker.lorem.word(),
        longitud: faker.address.longitude(),
        latitud: faker.address.latitude(),
        paginaWeb: faker.internet.url(),
        ciudades: []

      });
      supermercadoList.push(supermercado);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoService],
    }).compile();

    service = module.get<SupermercadoService>(SupermercadoService);
    repository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all supermarkets', async () => {
    const supermercados: SupermercadoEntity[] = await service.findAll();
    expect(supermercados).not.toBeNull();
    expect(supermercados).toHaveLength(supermercadoList.length);
  });

  it('findOne should return a supermarket by id', async () => {
    const storedSupermercado: SupermercadoEntity = supermercadoList[0];
    const supermercado: SupermercadoEntity = await service.findOne(storedSupermercado.id);
    expect(supermercado).not.toBeNull();
    expect(supermercado.nombre).toEqual(storedSupermercado.nombre);
  });

  it('create should return a new supermarket', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.lorem.word(11),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    };
  
    const newSupermercado: SupermercadoEntity = await service.create(supermercado);
    expect(newSupermercado).not.toBeNull();

    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: newSupermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(newSupermercado.nombre);
  });

  it('create should not return a new supermarket with wrong code', async () => {
    const supermercado: SupermercadoEntity = {
      id: '',
      nombre: faker.lorem.word(4),
      longitud: faker.address.longitude(),
      latitud: faker.address.latitude(),
      paginaWeb: faker.internet.url(),
      ciudades: []
    };
    await expect(() => service.create(supermercado)).rejects.toHaveProperty(
      'message',
      'The supermarket name with the given id has less than 11 characters',
    );

  });



  it('update should modify a supermarket}', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado.nombre = 'New name';
    const updatedSupermercado: SupermercadoEntity = await service.update(supermercado.id, supermercado);
    expect(updatedSupermercado).not.toBeNull();
    const storedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toEqual(supermercado.nombre);
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermercado: SupermercadoEntity = supermercadoList[0];
    supermercado = {
      ...supermercado,
      nombre: 'New name',
    };
    await expect(() => service.update('0', supermercado)).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermercado.id);
    const deletedSupermercado: SupermercadoEntity = await repository.findOne({
      where: { id: supermercado.id },
    });
    expect(deletedSupermercado).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await service.delete(supermercado.id);
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The supermarket with the given id was not found',
    );
  });

});
