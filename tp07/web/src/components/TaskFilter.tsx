import { type Task, TASKS, TASK_LABELS } from '../model';

interface TaskFilterProps {
  /** The selected task, or undefined for "all of them". */
  value: Task | undefined;
  onChange: (task: Task | undefined) => void;
}

/**
 * TODO step 4. The <nav> of the mockup: « Toutes », then one button per task
 * of TASKS. The selected one has aria-pressed="true". A click calls onChange.
 * This component holds no state: `value` comes from App.
 */
export const TaskFilter = ({ value, onChange }: TaskFilterProps) => {
  return (
    <nav className="filters" aria-label="Filtrer par tâche">
      <button 
        className="filter" 
        aria-pressed={value === undefined} 
        onClick={() => onChange(undefined)}
      >
        Toutes
      </button>
      
      {TASKS.map((task) => (
        <button 
          key={task}
          className="filter" 
          aria-pressed={value === task} 
          onClick={() => onChange(task)}
        >
          {TASK_LABELS[task]}
        </button>
      ))}
    </nav>
  );
};