import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './db/db-connect';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      ...dataSource,
      autoLoadEntities: true
    }),
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
