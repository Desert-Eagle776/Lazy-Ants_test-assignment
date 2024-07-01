import { ObjectLiteral } from "typeorm";

export interface IDeleteProduct {
  raw: ObjectLiteral[];
  affected?: number;
}