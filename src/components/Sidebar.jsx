import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',        icon: '📊', label: 'Dashboard' },
  { to: '/teams',   icon: '🛡️', label: 'Teams'     },
  { to: '/players', icon: '⚽', label: 'Players'   },
  { to: '/coaches', icon: '🎯', label: 'Coaches'   },
  { to: '/matches', icon: '🏆', label: 'Matches'   },
  { to: '/scores',  icon: '📋', label: 'Scores'    },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1> SPORT</h1>
        <p>Athlete Manager</p>
        <p style={{color:"red"}}>Group 17,18,19</p>
      </div>
      <nav className="sidebar-nav">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '1px' }}>
          SPORTS MGMT v1.0
        </p>
      </div>
    </aside>
  )
}
