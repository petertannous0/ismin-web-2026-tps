import { Controller, Get, Post, Delete, Param, Body, HttpCode, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ModelsService } from './models.service.js';
import { CreateModelDto } from './dto/create-model.dto.js';
/**
 * The controller: it translates HTTP ↔ domain. No business logic here.
 *
 * Everything is yours to write: the tests in `test/models.e2e-spec.ts`
 * describe the expected behaviour precisely.
 *
 * Routes to expose:
 *   GET    /models              → list (with ?org= and ?task= filters)
 *   GET    /models/:id          → one model, or 404
 *   POST   /models              → creation, status 201
 *   DELETE /models/:id          → removal, status 204, or 404
 */
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  // On récupère les filtres ?org= et ?task= depuis l'URL
  findAll(@Query('org') org?: string, @Query('task') task?: string) {
    return this.modelsService.findAll(org, task);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Post()
  // Le pipe bloque les requêtes invalides et celles qui ont des champs non déclarés
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() newModel: CreateModelDto) {
    this.modelsService.create(newModel as any);
    return newModel;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    this.modelsService.remove(id);
  }
}