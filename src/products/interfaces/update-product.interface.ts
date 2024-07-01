import { ObjectLiteral } from "typeorm";

export class IUpdateProduct {
  generatedMaps: ObjectLiteral[];
  raw: ObjectLiteral[];
  affected?: number;
}