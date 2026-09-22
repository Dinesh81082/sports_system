import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { matchesAPI, teamsAPI } from '../services/api'
import Modal from '../components/Modal'

const empty = { Ground: '', date: '', Home_team_id: '', Away_team_id: '' }

export default function Matches() {
  const [matches, setMatches] = useState([])
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(empty)

  const load = () => {
    setLoading(true)
    Promise.all([matchesAPI.getAll(), teamsAPI.getAll()])
      .then(([m, t]) => { setMatches(m.data); setTeams(t.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit   = (m)  => {
    setEditing(m)
    const d = m.date ? new Date(m.date).toISOString().slice(0, 16) : ''
    setForm({ Ground: m.Ground || '', date: d, Home_team_id: m.Home_team_id || '', Away_team_id: m.Away_team_id || '' })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.Home_team_id || !form.Away_team_id) return toast.error('Both teams are required')
    if (form.Home_team_id === form.Away_team_id) return toast.error('Teams must be different')
    try {
      if (editing) {
        await matchesAPI.update(editing.Match_id, form)
        toast.success('Match updated!')
      } else {
        await matchesAPI.create(form)
        toast.success('Match scheduled!')
      }
      setModal(false); load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this match?')) return
    try { await matchesAPI.remove(id); toast.success('Match deleted'); load() }
    catch (e) { toast.error('Cannot delete') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">MAT<span>CHES</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Schedule Match</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h2>All Matches</h2>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{matches.length} total</span>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : matches.length === 0 ? (
          <div className="empty"><div className="empty-icon">🏆</div><p>No matches scheduled yet.</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Home Team</th>
                <th>Score</th>
                <th>Away Team</th>
                <th>Ground</th>
                <th>Date</th>
                <th>Winner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => (
                <tr key={m.Match_id}>
                  <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                  <td><strong>{m.Home_team_name || '—'}</strong></td>
                  <td>
                    {m.Home_Score != null
                      ? <div className="score-box">
                          <span className="score-num">{m.Home_Score}</span>
                          <span className="score-vs">—</span>
                          <span className="score-num">{m.Away_Score}</span>
                        </div>
                      : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Not played</span>
                    }
                  </td>
                  <td><strong>{m.Away_team_name || '—'}</strong></td>
                  <td>{m.Ground || '—'}</td>
                  <td>{m.date ? new Date(m.date).toLocaleDateString('en-IN') : '—'}</td>
                  <td>
                    {m.Winner_name
                      ? <span className="badge badge-green">🏅 {m.Winner_name}</span>
                      : <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(m)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.Match_id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'EDIT MATCH' : 'SCHEDULE MATCH'} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Home Team *</label>
            <select value={form.Home_team_id} onChange={e => setForm({ ...form, Home_team_id: e.target.value })}>
              <option value="">— Select Home Team —</option>
              {teams.map(t => <option key={t.Team_id} value={t.Team_id}>{t.Team_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Away Team *</label>
            <select value={form.Away_team_id} onChange={e => setForm({ ...form, Away_team_id: e.target.value })}>
              <option value="">— Select Away Team —</option>
              {teams.map(t => <option key={t.Team_id} value={t.Team_id}>{t.Team_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ground / Venue</label>
            <input placeholder="e.g. Wankhede Stadium" value={form.Ground}
              onChange={e => setForm({ ...form, Ground: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Date & Time</label>
            <input type="datetime-local" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Schedule'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
