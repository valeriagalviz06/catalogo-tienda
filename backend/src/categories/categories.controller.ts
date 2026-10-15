import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
	ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	findAll() {
		return this.categoriesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.findOne(id);
	}

	@Post()
	create(@Body() body: any) {
		return this.categoriesService.create(body);
	}

	@Put(':id')
	update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
		return this.categoriesService.update(id, body);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.categoriesService.remove(id);
	}
}
