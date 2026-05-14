import { CASE_STATUS_LABELS } from '../../constants/caseOptions.js'
import { formatDate } from '../../utils/formatDate.js'
import './PackageList.css'

export function PackageList({ cases, hasActiveFilters, onClearFilters, onDeleteCase, onSelectCase, selectedCaseId }) {
  if (!cases.length) {
    return (
      <section className="panel empty-state">
        <h2>No folders match right now</h2>
        <p>
          {hasActiveFilters
            ? 'Try clearing the filing index or search to bring other folders back into view.'
            : 'Create your first folder in the cover-sheet panel to start tracking evidence and required forms.'}
        </p>

        {hasActiveFilters ? (
          <button className="button button--secondary" onClick={onClearFilters} type="button">
            Reset index
          </button>
        ) : null}
      </section>
    )
  }

  return (
    <section className="package-list">
      {cases.map((caseItem, index) => (
        <article className={`package-card panel ${selectedCaseId === caseItem.id ? 'package-card--active' : ''}`} key={caseItem.id}>
          <div className="package-card__tab">
            <span>{caseItem.caseType}</span>
            <span>Folder {String(index + 1).padStart(2, '0')}</span>
          </div>

          <div className="package-card__header">
            <div className="package-card__title-block">
              <span className={`status-pill status-pill--${caseItem.status}`}>{CASE_STATUS_LABELS[caseItem.status]}</span>
              <h3>{caseItem.title}</h3>
              <p className="package-card__note-line">
                Last touched {formatDate(caseItem.updatedAt)}
                {caseItem.dueDate ? ` • follow up ${formatDate(caseItem.dueDate)}` : ''}
              </p>
            </div>

            <div className="action-row">
              <button className="button button--ghost" onClick={() => onSelectCase(caseItem.id)} type="button">
                Open folder
              </button>
              <button className="button button--danger" onClick={() => onDeleteCase(caseItem.id)} type="button">
                Delete
              </button>
            </div>
          </div>

          <p className="package-card__summary">
            {caseItem.description || 'No cover note yet. Add context for what belongs inside this folder and what still needs to be gathered.'}
          </p>

          <div className="package-card__divider" />

          <div className="progress-block">
            <div className="progress-block__meta">
              <span>Checklist packet</span>
              <strong>{caseItem.progress}%</strong>
            </div>
            <div className="progress-block__track">
              <div className="progress-block__fill" style={{ width: `${caseItem.progress}%` }} />
            </div>
          </div>

          <div className="package-card__footer">
            <span>{caseItem.receivedCount} received</span>
            <span>{caseItem.missingCount} still open</span>
            <span>{caseItem.documentCount} logged item{caseItem.documentCount === 1 ? '' : 's'}</span>
          </div>
        </article>
      ))}
    </section>
  )
}
