import { useState } from 'react'
import { DOCUMENT_CATEGORY_OPTIONS, DOCUMENT_STATUS_OPTIONS } from '../../constants/caseOptions.js'
import './DocumentForm.css'

const EMPTY_DOCUMENT_FORM = {
  label: '',
  category: DOCUMENT_CATEGORY_OPTIONS[0],
  status: 'missing',
  note: '',
  dueDate: '',
  required: true
}

function getInitialDocumentForm(documentToEdit) {
  return documentToEdit
    ? {
        label: documentToEdit.label,
        category: documentToEdit.category,
        status: documentToEdit.status,
        note: documentToEdit.note,
        dueDate: documentToEdit.dueDate ?? '',
        required: documentToEdit.required
      }
    : EMPTY_DOCUMENT_FORM
}

export function DocumentForm({ documentToEdit, isSubmitting, onCancelEdit, onSubmit }) {
  const [formValues, setFormValues] = useState(() => getInitialDocumentForm(documentToEdit))
  const [localError, setLocalError] = useState('')

  function handleChange(event) {
    const { name, type, value, checked } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value
    }))
    setLocalError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (formValues.label.trim().length < 2) {
      setLocalError('Evidence label must be at least 2 characters.')
      return
    }

    try {
      await onSubmit(formValues)
    } catch {
      return
    }
  }

  function handleReset() {
    setFormValues(EMPTY_DOCUMENT_FORM)
    setLocalError('')
    onCancelEdit()
  }

  return (
    <form className="stack document-form" onSubmit={handleSubmit}>
      <div className="document-form__tab">{documentToEdit ? 'Edit evidence slip' : 'Evidence slip'}</div>

      <div className="section-heading">
        <div>
          <p className="app__eyebrow">{documentToEdit ? 'Edit evidence slip' : 'Add evidence slip'}</p>
          <h3>{documentToEdit ? 'Update the selected evidence entry' : 'Log a new document requirement'}</h3>
          <p className="document-form__copy">
            Each document gets its own note slip so the folder history stays easy to review.
          </p>
        </div>

        <button className="button button--ghost" onClick={handleReset} type="button">
          {documentToEdit ? 'Cancel edit' : 'Reset'}
        </button>
      </div>

      <label className="field">
        <span className="field__label">Evidence label</span>
        <input
          className="field__input"
          name="label"
          onChange={handleChange}
          placeholder="Passport copy"
          required
          type="text"
          value={formValues.label}
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span className="field__label">Category</span>
          <select className="field__input" name="category" onChange={handleChange} value={formValues.category}>
            {DOCUMENT_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select className="field__input" name="status" onChange={handleChange} value={formValues.status}>
            {DOCUMENT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field field--checkbox">
        <input checked={formValues.required} name="required" onChange={handleChange} type="checkbox" />
        <span>This item counts toward completion progress.</span>
      </label>

      <label className="field">
        <span className="field__label">Notes</span>
        <textarea
          className="field__input field__input--textarea"
          name="note"
          onChange={handleChange}
          placeholder="Add context, follow-up details, or what still needs verification."
          rows="3"
          value={formValues.note}
        />
      </label>

      <label className="field">
        <span className="field__label">Follow-up date</span>
        <input
          className="field__input"
          name="dueDate"
          onChange={handleChange}
          type="date"
          value={formValues.dueDate}
        />
      </label>

      {localError ? <div className="app__feedback app__feedback--error">{localError}</div> : null}

      <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving slip...' : documentToEdit ? 'Save evidence slip' : 'Add evidence slip'}
      </button>
    </form>
  )
}
