import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { IDeleteResponse } from './interfaces/delete-response.interface';
import { ApiBody, ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
  ) { }

  @Post('/create')
  @ApiTags('Products')
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ status: 201, description: 'The record has been successfully created.', type: ProductEntity })
  @ApiResponse({ status: 409, description: 'The product already exists' })
  createProduct(@Body() dto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.createProducts(dto);
  }

  @Put('/update/:id')
  @ApiTags('Products')
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.', type: ProductEntity })
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateProductDto
  ): Promise<ProductEntity> {
    return this.productService.updateProducts(id, dto);
  }

  @Delete('/delete/:id')
  @ApiTags('Products')
  @ApiResponse({ status: 200, description: 'The removal operation was successful.' })
  deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<IDeleteResponse> {
    return this.productService.deleteProducts(id);
  }

  @Get('/all')
  @ApiTags('Products')
  @ApiResponse({ status: 200, description: 'Returns all products.', type: [ProductEntity] })
  allProducts(): Promise<ProductEntity[]> {
    return this.productService.getAllProducts();
  }

  @Get('/:id')
  @ApiTags('Products')
  @ApiResponse({ status: 200, description: 'Get product by id.', type: ProductEntity })
  oneProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
    return this.productService.getOneProduct(id);
  }
}
