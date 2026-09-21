import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Model, Task, TASKS } from './model.js';

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(model: Model): Promise<Model> {
    // 1. On supprime l'ancien s'il existe
    await this.prisma.model.deleteMany({ where: { id: model.id } });
    
    // 2. On crée le modèle ET on le relie à son organisation
    const created = await this.prisma.model.create({
      data: {
        id: model.id,
        name: model.name,
        task: model.task,
        parameters: model.parameters,
        downloads: model.downloads,
        license: model.license,
        // C'est ici la magie de Prisma : il cherche l'organisation, 
        // et s'il ne la trouve pas, il la crée !
        organisation: {
          connectOrCreate: {
            where: { slug: model.org },
            create: { slug: model.org, name: model.org },
          },
        },
      },
      include: { organisation: true }, // On demande à Prisma de nous renvoyer l'organisation avec le modèle
    });

    return this.toModel(created);
  }

  async findAll(filters: { org?: string; task?: string } = {}): Promise<Model[]> {
    const rows = await this.prisma.model.findMany({
      where: { 
        task: filters.task,
        // On filtre sur le "slug" de la table organisation jointe
        organisation: filters.org ? { slug: filters.org } : undefined,
      },
      include: { organisation: true }, // Essentiel pour récupérer le nom de l'organisation
    });

    return rows.map((row) => this.toModel(row));
  }

  async findOne(id: string): Promise<Model> {
    const row = await this.prisma.model.findUnique({ 
      where: { id },
      include: { organisation: true }, // On joint la table organisation
    });

    if (!row) {
      throw new NotFoundException(`Model ${id} not found`);
    }

    return this.toModel(row);
  }

  async remove(id: string): Promise<boolean> {
    const { count } = await this.prisma.model.deleteMany({ where: { id } });
    return count > 0;
  }

  async clear(): Promise<void> {
    await this.prisma.model.deleteMany();
    // On nettoie aussi les organisations pour repartir à zéro dans les tests
    await this.prisma.organisation.deleteMany();
  }

private toModel(row: any): Model {
    if (!this.isTask(row.task)) {
      throw new Error(`Unknown task "${row.task}" for model ${row.id}`);
    }

    return {
      id: row.id,
      name: row.name,
      org: row.organisation.slug,
      task: row.task,
      parameters: row.parameters,
      downloads: row.downloads,
      ...(row.license === null ? {} : { license: row.license }),
    };
  }

  private isTask(value: string): value is Task {
    return (TASKS as string[]).includes(value);
  }
}