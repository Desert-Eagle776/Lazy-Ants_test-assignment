import * as dotenv from "dotenv";
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { IDeleteResponse } from "./interfaces/delete-response.interface";

dotenv.config();

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          username: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_TEST_DB,
          password: process.env.POSTGRES_PASSWORD,
          entities: [ProductEntity],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([ProductEntity])
      ],
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  afterEach(async () => {
    await repository.clear(); // self-cleaning "products" table after tests
  });

  const generateRandomName = () => `Product_${Math.random().toString(36).substring(7)}`;

  it('should return product', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };
    const product: ProductEntity = await service.createProducts(dto);

    expect(product).toEqual({ id: product.id, ...dto });
  });

  it('should find product by id', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await service.createProducts(dto);
    const findProduct = await service.getOneProduct(product.id);

    expect(findProduct).toEqual({ id: product.id, ...dto });
  });

  it('should find all products', async () => {
    const productName1: string = generateRandomName();
    const productName2: string = generateRandomName();

    await service.createProducts({ name: productName1, description: 'fruit', cost: 100, category: 'Fruits' });
    await service.createProducts({ name: productName2, description: 'fruit', cost: 10, category: 'Fruits' });

    const products = await service.getAllProducts();

    expect(products.length).toBe(2);
  });

  it('should update a product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await service.createProducts(dto);
    const updateProduct: ProductEntity = await service.updateProducts(product.id, { ...dto, cost: 10 });

    expect(updateProduct).toEqual({ id: product.id, ...dto, cost: 10 });
  });

  it('should delete a product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await service.createProducts(dto);
    const deleteProduct: IDeleteResponse = await service.deleteProducts(product.id);

    expect(deleteProduct).toEqual({ msg: 'The removal operation was successful.' });
  });
});
