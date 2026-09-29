import { type Model, TASK_LABELS } from '../model';
import { formatParameters, formatDownloads } from '../format';

export const ModelCard = ({ model }: { model: Model }) => {
  return (
    <article className="card">
      <header className="card-header">
        <h2 className="card-title">{model.name}</h2>
        <span className="badge">{TASK_LABELS[model.task]}</span>
      </header>
      <p className="card-org">{model.org}</p>
      <dl className="card-stats">
        <div>
          <dt>Paramètres</dt>
          <dd>{formatParameters(model.parameters)}</dd>
        </div>
        <div>
          <dt>Téléchargements</dt>
          <dd>{formatDownloads(model.downloads)}</dd>
        </div>
      </dl>
      {/* On affiche la licence uniquement si elle existe */}
{model.license ? <p className="card-license">Licence {model.license}</p> : null}
    </article>
  );
};