export type Task = "text-genration" | "translation" | "image-classification" | "speech-to-text";
export interface Model {
  id: string;
  name: string;
  org: string;
  task: Task;
  parameters: number;
  downloads: number;
  license?: string;
}
