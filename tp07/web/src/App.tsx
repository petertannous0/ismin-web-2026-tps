import { useEffect, useState } from 'react';
import type { Model, Task } from './model';
import { fetchModels } from './api';
import { ModelList } from './components/ModelList';
import { TaskFilter } from './components/TaskFilter';

const App = () => {
  const [task, setTask] = useState<Task | undefined>(undefined);
  
  // Nouveaux états pour le réseau : les données, le chargement, et les erreurs
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect se déclenche au démarrage ET à chaque fois que `task` change
  useEffect(() => {
    let ignore = false; // Pour éviter les bugs si on clique très vite sur plusieurs filtres

    async function loadModels() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchModels(task);
        if (!ignore) {
          setModels(data);
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Erreur réseau');
          setLoading(false);
        }
      }
    }

    loadModels();

    // Fonction de nettoyage
    return () => {
      ignore = true;
    };
  }, [task]);

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-title">ModelZoo</h1>
        <p className="app-tagline">Le catalogue des modèles d'IA</p>
      </header>

      <TaskFilter value={task} onChange={setTask} />

      {/* Affichage conditionnel selon l'état du réseau */}
      {loading && <p role="status" className="status">Chargement...</p>}
      
      {error && <p role="alert" className="error">Erreur : {error}</p>}
      
      {!loading && !error && <ModelList models={models} />}
    </main>
  );
};

export default App;