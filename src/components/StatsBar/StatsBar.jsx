import './StatsBar.css'

export function StatsBar({ stats }) {
  return (
    <section className="stats-bar">
      {stats.map((stat, index) => (
        <article className="stats-card panel" key={stat.label}>
          <span className="stats-card__index">{String(index + 1).padStart(2, '0')}</span>
          <span className="stats-card__label">{stat.label}</span>
          <strong className="stats-card__value">{stat.value}</strong>
          <p className="stats-card__detail">{stat.detail}</p>
        </article>
      ))}
    </section>
  )
}
