import './DashboardHeader.css'

export function DashboardHeader({ caseCount, onLogout, onNewCase, user }) {
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <header className="dashboard-header panel">
      <div className="dashboard-header__tab">Case binder</div>

      <div className="dashboard-header__strip">
        <span className="dashboard-header__chip">Owner: {firstName}</span>
        <span className="dashboard-header__chip">{caseCount} open folder{caseCount === 1 ? '' : 's'}</span>
        <span className="dashboard-header__chip">Prepared for paperwork review</span>
      </div>

      <div className="dashboard-header__layout">
        <div className="dashboard-header__copy">
          <p className="app__eyebrow">ProofPack file room</p>
          <h1 className="dashboard-header__title">Keep every submission packet orderly, calm, and ready to review.</h1>
          <p className="dashboard-header__text">
            Use folder covers, evidence notes, and checklist progress to keep paperwork moving without losing the small details.
          </p>
        </div>

        <div className="dashboard-header__side">
          <p className="dashboard-header__note">
            Pull a folder forward, update its cover sheet, and log every required document as it arrives.
          </p>

          <div className="action-row">
            <button className="button button--primary" onClick={onNewCase} type="button">
              New folder
            </button>
            <button className="button button--secondary" onClick={onLogout} type="button">
              Log out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
