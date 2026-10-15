import {
	Injectable,
	NotFoundException,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
	constructor(
		@InjectRepository(Category)
		private readonly categoriesRepo: Repository<Category>,
	) {}

	async findAll() {
		return this.categoriesRepo.find({
			order: { id: 'ASC' },
		});
	}

	async findOne(id: number) {
		const category = await this.categoriesRepo.findOne({ where: { id } });
		if (!category) {
			throw new NotFoundException('Categoría no encontrada');
		}
		return category;
	}

	async create(body: any) {
		const name = body.name?.trim();

		if (!name) {
			throw new BadRequestException('El nombre de la categoría es obligatorio');
		}

		const exists = await this.categoriesRepo.findOne({ where: { name } });
		if (exists) {
			throw new ConflictException('La categoría ya existe');
		}

		return this.categoriesRepo.save(this.categoriesRepo.create({ name }));
	}

	async update(id: number, body: any) {
		const category = await this.findOne(id);
		const name = body.name?.trim();

		if (!name) {
			throw new BadRequestException('El nombre de la categoría es obligatorio');
		}

		if (name !== category.name) {
			const exists = await this.categoriesRepo.findOne({ where: { name } });
			if (exists) {
				throw new ConflictException('La categoría ya existe');
			}
		}

		Object.assign(category, { name });
		return this.categoriesRepo.save(category);
	}

	async remove(id: number) {
		const category = await this.findOne(id);
		await this.categoriesRepo.remove(category);
		return { message: 'Categoría eliminada correctamente' };
	}
}
