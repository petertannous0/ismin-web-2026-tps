import type { Model, Task } from './model';

/** Given. Where the API runs, read from `.env`. The fallback is the port of `npm run start:dev`. */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * TODO step 5. GET /models, and GET /models?task=… when a task is given.
 * An answer that is not ok, a 404 or a 500, must throw: fetch does not do it
 * on its own.
 */
export async function fetchModels(task?: Task): Promise<Model[]> {
  const url = task ? `${API_URL}/models?task=${task}` : `${API_URL}/models`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erreur réseau : ${response.status}`);
  }
  
  return response.json();
}