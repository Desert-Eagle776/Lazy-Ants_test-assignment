import * as dotenv from 'dotenv';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { generateRandomName } from '../utils/utils';
import { CreateProductDto } from './dto/create-product.dto';
import { IDeleteResponse } from './interfaces/delete-response.interface';

dotenv.config();

describe('ProductsController', () => {
  let controller: ProductsController;
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
      controllers: [ProductsController],
      providers: [ProductsService]
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
  });

  afterEach(async () => {
    await repository.clear(); // self-cleaning "products" table after tests
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the created product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'desc', cost: 100, category: 'Fruits' };
    const product: ProductEntity = await controller.createProduct(dto);

    expect(product).toEqual({ id: product.id, ...dto });
  });

  it('should return a product by id', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'desc', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await controller.createProduct(dto);
    const getProduct: ProductEntity = await controller.oneProduct(product.id);

    expect(getProduct).toEqual({ id: product.id, ...dto });
  });

  it('should return all products', async () => {
    const products: ProductEntity[] = await controller.allProducts();

    expect(Array.isArray(products)).toBe(true);
  });

  it('should return updated the product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await controller.createProduct(dto);
    const updateProduct: ProductEntity = await controller.updateProduct(product.id, { ...dto, cost: 10 }); // update field 'cost'

    expect(updateProduct).toEqual({ id: product.id, ...dto, cost: 10 });
  });

  it('should return a message about the successful removal of the product', async () => {
    const productName: string = generateRandomName();
    const dto: CreateProductDto = { name: productName, description: 'fruit', cost: 100, category: 'Fruits' };

    const product: ProductEntity = await controller.createProduct(dto);
    const deleteProduct: IDeleteResponse = await controller.deleteProduct(product.id);

    expect(deleteProduct).toEqual({ msg: 'The removal operation was successful.' });
  });
});
