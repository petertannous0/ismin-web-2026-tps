import { IsString, IsNotEmpty, IsNumber, Min, IsIn, Matches, IsOptional } from 'class-validator';
import type { Task } from '../model.js';

// Liste des tâches autorisées, indispensable pour la vérification
const TASKS: Task[] = ['text-generation', 'translation', 'image-classification', 'speech-to-text'];

export class CreateModelDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/) // Rejette ce qui n'est pas un slug
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  org: string;

  @IsIn(TASKS)
  task: Task;

  @IsNumber()
  @Min(0) // Interdit les nombres négatifs
  parameters: number;

  @IsNumber()
  @Min(0)
  downloads: number;

  @IsOptional()
  @IsString()
  license?: string;
}