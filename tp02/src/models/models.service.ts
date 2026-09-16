import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelZoo } from './model-zoo.js';
import type { Model } from './model.js';

@Injectable()
export class ModelsService {
  private zoo = new ModelZoo();

  clear(): void {
    this.zoo = new ModelZoo();
  }

  create(model: Model): void {
    this.zoo.addModel(model);
  }

  // La méthode applique les filtres si le contrôleur les transmet
  findAll(org?: string, task?: string): Model[] {
    let allModels = this.zoo.getAllModels();

    if (org) {
      allModels = allModels.filter(model => model.org === org);
    }
    if (task) {
      allModels = allModels.filter(model => model.task === task);
    }

    return allModels;
  }

  findOne(id: string): Model {
    const model = this.zoo.getModel(id);
    if (!model) {
      throw new NotFoundException(`Model ${id} not found`);
    }
    return model;
  }

  remove(id: string): void {
    const isDeleted = this.zoo.removeModel(id);
    if (!isDeleted) {
      throw new NotFoundException(`Model ${id} not found`);
    }
  }
}