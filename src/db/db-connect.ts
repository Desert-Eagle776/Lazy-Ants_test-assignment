import { DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSource: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  entities: ['dist/**/*.entity{.ts,.js}'],
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
}