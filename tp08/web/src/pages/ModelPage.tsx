import { Link, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchModel, ApiError } from '../api';
import { TASK_LABELS } from '../model';
import { formatParameters, formatDownloads } from '../format';

/**
 * The page of one model, at /models/:id.
 */
export const ModelPage = () => {
  // 1. On récupère l'id directement depuis l'URL (ex: t5-base)
  const { id } = useParams();

  // 2. On lance la requête avec TanStack Query
  const { data: model, isPending, error } = useQuery({
    queryKey: ['model', id], // La clé contient l'id pour séparer le cache de chaque modèle
    queryFn: () => fetchModel(id as string),
  });

  // 3. État : Chargement
  if (isPending) {
    return (
      <section className="page">
        <Link className="back" to="/">← Retour au catalogue</Link>
        <p role="status" className="status">Chargement…</p>
      </section>
    );
  }

  // 4. État : Erreur (avec gestion spécifique du 404)
  if (error) {
    const is404 = error instanceof ApiError && error.status === 404;
    return (
      <section className="page">
        <Link className="back" to="/">← Retour au catalogue</Link>
        <p role="alert" className="error">
          {is404 ? 'Modèle introuvable.' : 'Une erreur est survenue.'}
        </p>
      </section>
    );
  }

  // 5. État : Succès (affichage du modèle)
  return (
    <section className="page">
      <Link className="back" to="/">
        ← Retour au catalogue
      </Link>

      <article className="detail">
        <header className="detail-header">
          <h2 className="detail-title">{model.name}</h2>
          <span className="badge">{TASK_LABELS[model.task]}</span>
        </header>

        <dl className="detail-fields">
          <div>
            <dt>Identifiant</dt>
            <dd>{model.id}</dd>
          </div>
          <div>
            <dt>Organisation</dt>
            <dd>{model.org}</dd>
          </div>
          <div>
            <dt>Paramètres</dt>
            <dd>{formatParameters(model.parameters)}</dd>
          </div>
          <div>
            <dt>Téléchargements</dt>
            <dd>{formatDownloads(model.downloads)}</dd>
          </div>
          <div>
            <dt>Licence</dt>
            {/* S'il n'y a pas de licence, on affiche "Non précisée" */}
            <dd>{model.license ? model.license : 'Non précisée'}</dd>
          </div>
          {/* Si "createdBy" n'existe pas, on n'affiche pas du tout cette section */}
          {model.createdBy && (
            <div>
              <dt>Ajouté par</dt>
              <dd>{model.createdBy}</dd>
            </div>
          )}
        </dl>
      </article>
    </section>
  );
};