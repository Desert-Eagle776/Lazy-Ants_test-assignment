import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { IProduct } from './interfaces/product.interface';
import { IDeleteProduct } from './interfaces/delete-product.interface';
import { IDeleteResponse } from './interfaces/delete-response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>
  ) { }

  async createProducts(dto: CreateProductDto): Promise<ProductEntity> {
    const checkProduct: ProductEntity | null = await this.productRepository.findOne({
      where: {
        name: dto.name,
      }
    });

    if (checkProduct) {
      throw new HttpException("The product already exists.", HttpStatus.CONFLICT);
    }

    const addProduct: IProduct = this.productRepository.create({ ...dto });
    const saveProduct: ProductEntity = await this.productRepository.save(addProduct);

    return saveProduct;
  }

  async getOneProduct(id: number): Promise<ProductEntity> {
    const product: ProductEntity | null = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException("Product not found.", HttpStatus.NOT_FOUND);
    }

    return product;
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    const products: ProductEntity[] = await this.productRepository.find();
    return products;
  }

  async updateProducts(id: number, dto: CreateProductDto): Promise<ProductEntity> {
    const product: ProductEntity | null = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException("Product not found.", HttpStatus.NOT_FOUND);
    }

    // product update
    await this.productRepository.update(id, { ...dto });

    const modifyProduct: ProductEntity = await this.productRepository.findOneBy({ id });
    return modifyProduct;
  }

  async deleteProducts(id: number): Promise<IDeleteResponse> {
    const product: ProductEntity | null = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException("Product not found.", HttpStatus.NOT_FOUND);
    }

    const removeProduct: IDeleteProduct = await this.productRepository.delete(product);
    if (!removeProduct && !removeProduct.affected) {
      throw new HttpException("Error deleting data.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return { msg: 'The removal operation was successful.' };
  }
}
