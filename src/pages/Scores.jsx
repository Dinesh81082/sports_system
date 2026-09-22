import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { scoresAPI, matchesAPI, teamsAPI } from '../services/api'
import Modal from '../components/Modal'

const empty = { Match_id: '', Win_team: '', Home_Score: '', Away_Score: '' }

export default function Scores() {
  const [scores, setScores]   = useState([])
  const [matches, setMatches] = useState([])
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(empty)

  const load = () => {
    setLoading(true)
    Promise.all([scoresAPI.getAll(), matchesAPI.getAll(), teamsAPI.getAll()])
      .then(([s, m, t]) => { setScores(s.data); setMatches(m.data); setTeams(t.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit   = (s) => {
    setEditing(s)
    setForm({ Match_id: s.Match_id, Win_team: s.Win_team || '', Home_Score: s.Home_Score, Away_Score: s.Away_Score })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.Match_id) return toast.error('Match is required')
    if (form.Home_Score === '' || form.Away_Score === '') return toast.error('Both scores are required')
    try {
      if (editing) {
        await scoresAPI.update(editing.Score_id, form)
        toast.success('Score updated!')
      } else {
        await scoresAPI.create(form)
        toast.success('Score recorded!')
      }
      setModal(false); load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this score?')) return
    try { await scoresAPI.remove(id); toast.success('Score deleted'); load() }
    catch (e) { toast.error('Cannot delete') }
  }

  // Get teams for selected match
  const selectedMatch = matches.find(m => String(m.Match_id) === String(form.Match_id))
  const matchTeams = selectedMatch
    ? teams.filter(t => t.Team_id === selectedMatch.Home_team_id || t.Team_id === selectedMatch.Away_team_id)
    : teams

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">SCO<span>RES</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Record Score</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h2>Match Results</h2>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{scores.length} results</span>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : scores.length === 0 ? (
          <div className="empty"><div className="empty-icon">📋</div><p>No scores recorded yet.</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Match</th>
                <th>Date</th>
                <th>Home Score</th>
                <th>Away Score</th>
                <th>Winner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.Score_id}>
                  <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{s.Home_team_name} vs {s.Away_team_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>📍 {s.Ground || '—'}</div>
                  </td>
                  <td>{s.date ? new Date(s.date).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    <span style={{
                      fontSize: '1.4rem', fontFamily: 'var(--font-head)',
                      color: s.Home_Score > s.Away_Score ? 'var(--green)' : 'var(--accent)'
                    }}>{s.Home_Score}</span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '1.4rem', fontFamily: 'var(--font-head)',
                      color: s.Away_Score > s.Home_Score ? 'var(--green)' : 'var(--accent)'
                    }}>{s.Away_Score}</span>
                  </td>
                  <td>
                    {s.Winner_name
                      ? <span className="badge badge-green">🏆 {s.Winner_name}</span>
                      : <span className="badge badge-orange">Draw</span>}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.Score_id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'EDIT SCORE' : 'RECORD SCORE'} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Select Match *</label>
            <select value={form.Match_id} onChange={e => setForm({ ...form, Match_id: e.target.value, Win_team: '' })}>
              <option value="">— Select Match —</option>
              {matches.map(m => (
                <option key={m.Match_id} value={m.Match_id}>
                  {m.Home_team_name} vs {m.Away_team_name} ({m.Ground || 'No venue'})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Home Score *</label>
              <input type="number" min="0" placeholder="0" value={form.Home_Score}
                onChange={e => setForm({ ...form, Home_Score: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Away Score *</label>
              <input type="number" min="0" placeholder="0" value={form.Away_Score}
                onChange={e => setForm({ ...form, Away_Score: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Winner Team</label>
            <select value={form.Win_team} onChange={e => setForm({ ...form, Win_team: e.target.value })}>
              <option value="">— Draw / No winner —</option>
              {matchTeams.map(t => <option key={t.Team_id} value={t.Team_id}>{t.Team_name}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Record Score'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
