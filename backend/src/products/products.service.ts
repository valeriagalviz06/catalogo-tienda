import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  async findAll(search?: string, categoryId?: string) {
    const where: any = {};

    if (search?.trim()) {
      const term = search.trim();
      const products = await this.productsRepo
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .where('product.name LIKE :term OR product.sku LIKE :term', {
          term: `%${term}%`,
        })
        .andWhere(categoryId ? 'category.id = :categoryId' : '1=1', {
          categoryId: Number(categoryId),
        })
        .orderBy('product.id', 'DESC')
        .getMany();
      return products;
    }

    if (categoryId) where.category = { id: Number(categoryId) };

    return this.productsRepo.find({
      where,
      relations: ['category'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(body: any) {
    this.validate(body);
    const duplicate = await this.productsRepo.findOne({
      where: { sku: body.sku },
    });
    if (duplicate) throw new ConflictException('El SKU ya existe');

    const category = await this.categoriesRepo.findOne({
      where: { id: Number(body.categoryId) },
    });
    if (!category) throw new BadRequestException('Categoría no válida');

    const product = this.productsRepo.create({
      name: body.name.trim(),
      sku: body.sku.trim(),
      description: body.description || '',
      price: Number(body.price),
      stock: Number(body.stock),
      category,
    });
    return this.productsRepo.save(product);
  }

  async update(id: number, body: any) {
    const product = await this.findOne(id);
    this.validate(body);

    if (body.sku !== product.sku) {
      const duplicate = await this.productsRepo.findOne({
        where: { sku: body.sku },
      });
      if (duplicate) throw new ConflictException('El SKU ya existe');
    }

    const category = await this.categoriesRepo.findOne({
      where: { id: Number(body.categoryId) },
    });
    if (!category) throw new BadRequestException('Categoría no válida');

    Object.assign(product, {
      name: body.name.trim(),
      sku: body.sku.trim(),
      description: body.description || '',
      price: Number(body.price),
      stock: Number(body.stock),
      category,
    });

    return this.productsRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepo.remove(product);
    return { message: 'Producto eliminado correctamente' };
  }

  private validate(body: any) {
    if (!body.name?.trim()) {
      throw new BadRequestException('El nombre es obligatorio');
    }
    if (!body.sku?.trim()) {
      throw new BadRequestException('El SKU es obligatorio');
    }
    if (!Number.isFinite(Number(body.price)) || Number(body.price) <= 0) {
      throw new BadRequestException('El precio debe ser mayor que cero');
    }
    if (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0) {
      throw new BadRequestException('El stock debe ser un entero igual o mayor que cero');
    }
    if (!Number.isInteger(Number(body.categoryId)) || Number(body.categoryId) <= 0) {
      throw new BadRequestException('Selecciona una categoría válida');
    }
  }
}