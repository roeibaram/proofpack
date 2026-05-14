import { CASE_STATUS_LABELS, CASE_STATUS_OPTIONS, CASE_TYPE_OPTIONS } from '../../constants/caseOptions.js'
import './FilterBar.css'

export function FilterBar({
  caseTypeFilter,
  hasActiveFilters,
  onCaseTypeChange,
  onClearFilters,
  onSearchChange,
  onStatusChange,
  onSortModeChange,
  searchQuery,
  sortMode,
  statusFilter
}) {
  const statusLabel = statusFilter === 'all' ? 'All stages' : CASE_STATUS_LABELS[statusFilter]
  const caseTypeLabel = caseTypeFilter === 'all' ? 'All folder types' : caseTypeFilter
  const sortLabel =
    {
      recent: 'Recent activity',
      followUp: 'Nearest follow-up',
      missing: 'Most open items',
      progress: 'Most complete'
    }[sortMode] ?? 'Recent activity'

  return (
    <section className="panel filter-bar">
      <div className="filter-bar__tabs">
        <span className="filter-bar__tab">Search file</span>
        <span className="filter-bar__tab">{statusLabel}</span>
        <span className="filter-bar__tab">{caseTypeLabel}</span>
        <span className="filter-bar__tab">{sortLabel}</span>
      </div>

      <div className="filter-bar__heading">
        <div>
          <p className="app__eyebrow">Folder drawer</p>
          <h2>Pull the right folder to the front</h2>
          <p className="filter-bar__copy">Use the filing index below to sort by stage, type, or note content.</p>
        </div>

        {hasActiveFilters ? (
          <button className="button button--ghost" onClick={onClearFilters} type="button">
            Clear index
          </button>
        ) : null}
      </div>

      <div className="filter-bar__controls">
        <label className="field">
          <span className="field__label">Search</span>
          <input
            className="field__input"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search title, case type, or notes"
            type="search"
            value={searchQuery}
          />
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            className="field__input"
            onChange={(event) => onStatusChange(event.target.value)}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            {CASE_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Case type</span>
          <select
            className="field__input"
            onChange={(event) => onCaseTypeChange(event.target.value)}
            value={caseTypeFilter}
          >
            <option value="all">All case types</option>
            {CASE_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Sort by</span>
          <select className="field__input" onChange={(event) => onSortModeChange(event.target.value)} value={sortMode}>
            <option value="recent">Recent activity</option>
            <option value="followUp">Nearest follow-up</option>
            <option value="missing">Most open items</option>
            <option value="progress">Most complete</option>
          </select>
        </label>
      </div>
    </section>
  )
}
