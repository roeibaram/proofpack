import { useState } from 'react'
import './AuthPanel.css'

const EMPTY_AUTH_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
}

export function AuthPanel({ errorMessage, isSubmitting, onClearError, onLogin, onRegister }) {
  const [mode, setMode] = useState('register')
  const [formValues, setFormValues] = useState(EMPTY_AUTH_FORM)
  const [localError, setLocalError] = useState('')

  function handleModeChange(nextMode) {
    setMode(nextMode)
    setFormValues(EMPTY_AUTH_FORM)
    setLocalError('')
    onClearError()
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))

    if (localError || errorMessage) {
      setLocalError('')
      onClearError()
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (mode === 'register' && formValues.password !== formValues.confirmPassword) {
      setLocalError('Passwords must match before you create the account.')
      return
    }

    try {
      if (mode === 'login') {
        await onLogin({
          email: formValues.email,
          password: formValues.password
        })
      } else {
        await onRegister({
          name: formValues.name,
          email: formValues.email,
          password: formValues.password
        })
      }
    } catch {
      return
    }
  }

  return (
    <section className="auth">
      <div className="auth__story panel">
        <div className="auth__tab">Accordion folder</div>
        <p className="app__eyebrow">ProofPack V1</p>
        <h1 className="auth__title">Keep every checklist, case file, and missing document in one practical workspace.</h1>
        <p className="auth__copy">
          Build orderly folders for immigration, insurance, housing, taxes, or any other paperwork-heavy process.
        </p>

        <div className="auth__feature-grid">
          <article className="auth__feature">
            <span className="auth__feature-kicker">Folder drawer</span>
            <p>Open the right case quickly, review its note, and see what still blocks submission.</p>
          </article>
          <article className="auth__feature">
            <span className="auth__feature-kicker">Evidence slips</span>
            <p>Mark items as missing, requested, or received and keep every note attached to the right document.</p>
          </article>
          <article className="auth__feature">
            <span className="auth__feature-kicker">Built for growth</span>
            <p>V1 is ready for uploads, OCR, categorization, and export later without changing the core folder model.</p>
          </article>
        </div>
      </div>

      <div className="auth__card panel">
        <div className="auth__tabs" role="tablist" aria-label="Authentication options">
          <button
            className={`auth__tab-button ${mode === 'register' ? 'auth__tab-button--active' : ''}`}
            onClick={() => handleModeChange('register')}
            type="button"
          >
            Create account
          </button>
          <button
            className={`auth__tab-button ${mode === 'login' ? 'auth__tab-button--active' : ''}`}
            onClick={() => handleModeChange('login')}
            type="button"
          >
            Sign in
          </button>
        </div>

        <div className="auth__intro">
          <h2>{mode === 'register' ? 'Open your workspace' : 'Welcome back'}</h2>
          <p>{mode === 'register' ? 'Create an account to start your first filing folder.' : 'Use the account you already created for this workspace.'}</p>
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className="field">
              <span className="field__label">Full name</span>
              <input
                className="field__input"
                name="name"
                onChange={handleChange}
                placeholder="Roei Baram"
                required
                type="text"
                value={formValues.name}
              />
            </label>
          ) : null}

          <label className="field">
            <span className="field__label">Email</span>
            <input
              autoComplete="email"
              className="field__input"
              name="email"
              onChange={handleChange}
              placeholder="name@example.com"
              required
              type="email"
              value={formValues.email}
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className="field__input"
              name="password"
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              type="password"
              value={formValues.password}
            />
          </label>

          {mode === 'register' ? (
            <label className="field">
              <span className="field__label">Confirm password</span>
              <input
                autoComplete="new-password"
                className="field__input"
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Repeat the same password"
                required
                type="password"
                value={formValues.confirmPassword}
              />
            </label>
          ) : null}

          {localError || errorMessage ? <div className="app__feedback app__feedback--error">{localError || errorMessage}</div> : null}

          <button className="button button--primary button--full" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? 'Saving...'
              : mode === 'register'
                ? 'Create ProofPack account'
                : 'Sign in to workspace'}
          </button>
        </form>
      </div>
    </section>
  )
}
