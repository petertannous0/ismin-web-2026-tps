import type {Model, Task} from "./model";
export class ModelZoo {
    private readonly models: Map<string, Model> = new Map();
    addModel(model: Model): void {
        this.models.set(model.id, model);
    }
    getModel(id: string): Model | undefined {
        return this.models.get(id);
    }
    getModelsOf(org: string): Model[] {
        return Array.from(this.models.values()).filter(model => model.org === org);
    }
    getAllModels(): Model[] {
        return Array.from(this.models.values());
    }
    getTotalNumberOfModels(): number {
        return this.models.size;
    }
    getModelsByTask(task: Model["task"]): Model[] {
        return Array.from(this.models.values()).filter(model => model.task === task);
    }
    // Calcule la somme de tous les téléchargements avec .reduce()
  getTotalDownloads(): number {
    return Array.from(this.models.values()).reduce((sum, model) => sum + model.downloads, 0);
  }

  // Retourne les organisations sans doublons en utilisant un Set
  getOrganisations(): string[] {
    const allOrgs = Array.from(this.models.values()).map(model => model.org);
    return Array.from(new Set(allOrgs));
  }
  // 1. The typed URL : Le type de retour empêche de renvoyer n'importe quelle chaîne de caractères
  huggingFaceUrl(model: Model): `https://huggingface.co/${string}` {
    return `https://huggingface.co/${model.org}/${model.id}`;
  }

  // 3. Grouping : Un seul reduce pour classer les modèles par tâche sans utiliser "any"
  groupByTask(): Partial<Record<Task, Model[]>> {
    return Array.from(this.models.values()).reduce<Partial<Record<Task, Model[]>>>((acc, model) => {
      if (!acc[model.task]) {
        acc[model.task] = [];
      }
      acc[model.task]!.push(model);
      return acc;
    }, {});
  }
}