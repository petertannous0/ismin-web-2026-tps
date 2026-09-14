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
}