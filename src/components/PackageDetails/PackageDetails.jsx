import { CASE_STATUS_LABELS, DOCUMENT_STATUS_LABELS } from '../../constants/caseOptions.js'
import { getDueLabel, getDueTone } from '../../utils/dueDates.js'
import { formatDate } from '../../utils/formatDate.js'
import { DocumentForm } from '../DocumentForm/DocumentForm.jsx'
import './PackageDetails.css'

export function PackageDetails({
  caseItem,
  documentToEdit,
  isSavingDocument,
  onCancelDocumentEdit,
  onDeleteDocument,
  onEditDocument,
  onSaveDocument
}) {
  const timelineDocuments = caseItem
    ? [...caseItem.documents].sort((leftDocument, rightDocument) => {
        return new Date(rightDocument.updatedAt) - new Date(leftDocument.updatedAt)
      })
    : []

  if (!caseItem) {
    return (
      <section className="panel empty-state">
        <h2>Pick a folder to open its binder</h2>
        <p>
          Select a folder from the drawer to add document requirements, update item statuses, and keep notes tied to the same workflow.
        </p>
      </section>
    )
  }

  return (
    <section className="panel stack package-details">
      <div className="package-details__tab">Evidence binder</div>

      <div className="section-heading">
        <div>
          <p className="app__eyebrow">Open folder</p>
          <h2>{caseItem.title}</h2>
          <p className="section-heading__copy">{caseItem.caseType}</p>
        </div>

        <div className="detail-stats">
          <span>{CASE_STATUS_LABELS[caseItem.status]}</span>
          <span>{caseItem.receivedCount} received</span>
          <span>{caseItem.missingCount} open</span>
          {caseItem.dueDate ? (
            <span className={`due-chip due-chip--${getDueTone(caseItem.dueDate)}`}>{getDueLabel(caseItem.dueDate)}</span>
          ) : null}
        </div>
      </div>

      <div className="detail-summary">
        <div className="detail-summary__grid">
          <div className="detail-summary__field">
            <span className="detail-summary__label">Folder type</span>
            <strong>{caseItem.caseType}</strong>
          </div>
          <div className="detail-summary__field">
            <span className="detail-summary__label">Opened</span>
            <strong>{formatDate(caseItem.createdAt)}</strong>
          </div>
          <div className="detail-summary__field">
            <span className="detail-summary__label">Latest activity</span>
            <strong>{formatDate(caseItem.updatedAt)}</strong>
          </div>
          <div className="detail-summary__field">
            <span className="detail-summary__label">Next follow-up</span>
            <strong>{caseItem.dueDate ? formatDate(caseItem.dueDate) : 'Not scheduled'}</strong>
          </div>
        </div>

        <p>{caseItem.description || 'Add a cover note in the folder sheet to explain the purpose of this file and any submission constraints.'}</p>
        <div className="progress-block">
          <div className="progress-block__meta">
            <span>Checklist packet completion</span>
            <strong>{caseItem.progress}%</strong>
          </div>
          <div className="progress-block__track">
            <div className="progress-block__fill" style={{ width: `${caseItem.progress}%` }} />
          </div>
        </div>
      </div>

      <DocumentForm
        key={`${caseItem.id}-${documentToEdit?.id ?? 'new-document'}`}
        documentToEdit={documentToEdit}
        isSubmitting={isSavingDocument}
        onCancelEdit={onCancelDocumentEdit}
        onSubmit={onSaveDocument}
      />

      <div className="stack">
        <div className="section-heading">
          <div>
            <p className="app__eyebrow">Evidence timeline</p>
            <h3>Document entries</h3>
          </div>
          <span className="package-details__timeline-count">{timelineDocuments.length} logged item{timelineDocuments.length === 1 ? '' : 's'}</span>
        </div>

        {timelineDocuments.length ? (
          <div className="document-list">
            {timelineDocuments.map((document, index) => (
              <article className={`document-card document-card--${document.status}`} key={document.id}>
                <div className="document-card__paper">
                  <div className="document-card__header">
                    <div>
                      <span className={`status-pill status-pill--${document.status}`}>{DOCUMENT_STATUS_LABELS[document.status]}</span>
                      {document.dueDate ? (
                        <span className={`due-chip due-chip--${getDueTone(document.dueDate)}`}>{getDueLabel(document.dueDate)}</span>
                      ) : null}
                      <h4>{document.label}</h4>
                      <p>
                        {document.category}
                        {document.required ? ' • required' : ' • optional'}
                      </p>
                    </div>

                    <div className="action-row">
                      <button className="button button--ghost" onClick={() => onEditDocument(document)} type="button">
                        Edit
                      </button>
                      <button className="button button--danger" onClick={() => onDeleteDocument(document.id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="document-card__note">
                    {document.note || 'No notes added yet. Use notes to explain what is missing or which follow-up is pending.'}
                  </p>

                  <div className="document-card__footer">
                    <span>Entry {String(index + 1).padStart(2, '0')}</span>
                    <span>{document.dueDate ? `Follow up ${formatDate(document.dueDate)}` : 'No follow-up date'}</span>
                    <span>Updated {formatDate(document.updatedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state empty-state--compact">
            <h3>No evidence slips yet</h3>
            <p>Use the form above to add the first evidence entry for this folder.</p>
          </div>
        )}
      </div>
    </section>
  )
}
