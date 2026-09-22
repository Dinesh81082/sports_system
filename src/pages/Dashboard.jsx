import { useEffect, useState } from 'react'
import { teamsAPI, playersAPI, coachesAPI, matchesAPI } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ teams: 0, players: 0, coaches: 0, matches: 0 })
  const [recentMatches, setRecentMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      teamsAPI.getAll(),
      playersAPI.getAll(),
      coachesAPI.getAll(),
      matchesAPI.getAll(),
    ]).then(([t, p, c, m]) => {
      setStats({
        teams:   t.data.length,
        players: p.data.length,
        coaches: c.data.length,
        matches: m.data.length,
      })
      setRecentMatches(m.data.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading"><div className="spinner" /><span>Loading dashboard...</span></div>
  )

  const cards = [
    { icon: '🛡️', label: 'Teams',   value: stats.teams   },
    { icon: '⚽', label: 'Players', value: stats.players },
    { icon: '🎯', label: 'Coaches', value: stats.coaches },
    { icon: '🏆', label: 'Matches', value: stats.matches },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">DASH<span>BOARD</span></h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="stats-grid">
        {cards.map(({ icon, label, value }) => (
          <div className="stat-card" key={label}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
              <h3>{value}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <h2 className="section-title">Recent Matches</h2>
        {recentMatches.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🏟️</div>
            <p>No matches recorded yet.</p>
          </div>
        ) : (
          recentMatches.map((m) => (
            <div className="match-card" key={m.Match_id}>
              <div>
                <div className="match-teams">
                  <span>{m.Home_team_name || 'TBD'}</span>
                  {m.Home_Score != null
                    ? <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-head)', fontSize: '1.2rem' }}>
                        {m.Home_Score} – {m.Away_Score}
                      </span>
                    : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>vs</span>
                  }
                  <span>{m.Away_team_name || 'TBD'}</span>
                </div>
                <div className="match-meta">
                  📍 {m.Ground || '—'} &nbsp;|&nbsp; 📅 {m.date ? new Date(m.date).toLocaleDateString('en-IN') : '—'}
                </div>
              </div>
              {m.Winner_name && (
                <span className="badge badge-green">🏅 {m.Winner_name}</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
