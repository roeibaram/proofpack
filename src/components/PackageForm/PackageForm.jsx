import { useState } from 'react'
import { CASE_STATUS_OPTIONS, CASE_TYPE_OPTIONS } from '../../constants/caseOptions.js'
import './PackageForm.css'

const EMPTY_CASE_FORM = {
  title: '',
  caseType: CASE_TYPE_OPTIONS[0],
  status: 'draft',
  description: ''
}

function getInitialCaseForm(caseToEdit) {
  return caseToEdit
    ? {
        title: caseToEdit.title,
        caseType: caseToEdit.caseType,
        status: caseToEdit.status,
        description: caseToEdit.description
      }
    : EMPTY_CASE_FORM
}

export function PackageForm({ caseToEdit, isSubmitting, onCancelSelection, onSubmit }) {
  const [formValues, setFormValues] = useState(() => getInitialCaseForm(caseToEdit))
  const [localError, setLocalError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
    setLocalError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (formValues.title.trim().length < 3) {
      setLocalError('Package title must be at least 3 characters.')
      return
    }

    try {
      await onSubmit(formValues)
    } catch {
      return
    }
  }

  function handleStartFresh() {
    setFormValues(EMPTY_CASE_FORM)
    setLocalError('')
    onCancelSelection()
  }

  return (
    <section className="panel stack package-form">
      <div className="package-form__tab">{caseToEdit ? 'Folder cover' : 'New folder'}</div>

      <div className="section-heading">
        <div>
          <p className="app__eyebrow">{caseToEdit ? 'Edit folder' : 'Folder cover sheet'}</p>
          <h2>{caseToEdit ? 'Update the selected folder' : 'Prepare a new folder cover sheet'}</h2>
          <p className="package-form__copy">
            Set the folder title, filing type, and the short note that explains what this paperwork packet covers.
          </p>
        </div>

        <button className="button button--ghost" onClick={handleStartFresh} type="button">
          {caseToEdit ? 'Blank sheet' : 'Reset'}
        </button>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Package title</span>
          <input
            className="field__input"
            name="title"
            onChange={handleChange}
            placeholder="Family-based immigration folder"
            required
            type="text"
            value={formValues.title}
          />
        </label>

        <div className="form-grid">
          <label className="field">
            <span className="field__label">Case type</span>
            <select className="field__input" name="caseType" onChange={handleChange} value={formValues.caseType}>
              {CASE_TYPE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Stage</span>
            <select className="field__input" name="status" onChange={handleChange} value={formValues.status}>
              {CASE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span className="field__label">Summary</span>
          <textarea
            className="field__input field__input--textarea"
            name="description"
            onChange={handleChange}
            placeholder="Describe what this folder covers, which parties are involved, and what still needs to be collected."
            rows="4"
            value={formValues.description}
          />
        </label>

        {localError ? <div className="app__feedback app__feedback--error">{localError}</div> : null}

        <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Saving folder...' : caseToEdit ? 'Save folder changes' : 'Create folder'}
        </button>
      </form>
    </section>
  )
}
