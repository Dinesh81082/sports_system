import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { playersAPI, teamsAPI } from '../services/api'
import Modal from '../components/Modal'

const empty = { PLY_name: '', Team_id: '', Position: '' }
const positions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper', 'Striker', 'Winger', 'Sweeper']

export default function Players() {
  const [players, setPlayers] = useState([])
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(empty)
  const [search, setSearch]   = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([playersAPI.getAll(), teamsAPI.getAll()])
      .then(([p, t]) => { setPlayers(p.data); setTeams(t.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = players.filter(p =>
    p.PLY_name.toLowerCase().includes(search.toLowerCase()) ||
    (p.Team_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.Position  || '').toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit   = (p)  => {
    setEditing(p)
    setForm({ PLY_name: p.PLY_name, Team_id: p.Team_id || '', Position: p.Position || '' })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.PLY_name.trim()) return toast.error('Player name is required')
    try {
      if (editing) {
        await playersAPI.update(editing.PLY_id, form)
        toast.success('Player updated!')
      } else {
        await playersAPI.create(form)
        toast.success('Player added!')
      }
      setModal(false); load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this player?')) return
    try { await playersAPI.remove(id); toast.success('Player deleted'); load() }
    catch (e) { toast.error('Cannot delete') }
  }

  const posColors = { Forward: 'badge-orange', Midfielder: 'badge-blue', Defender: 'badge-green', Goalkeeper: 'badge-red' }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">PLAY<span>ERS</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Player</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h2>All Players</h2>
          <input
            placeholder="🔍  Search players..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: '8px', padding: '8px 14px', color: 'var(--text)',
              fontSize: '0.875rem', width: '220px', outline: 'none', fontFamily: 'var(--font-body)'
            }}
          />
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">⚽</div><p>No players found.</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Player Name</th>
                <th>Team</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.PLY_id}>
                  <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                  <td><strong>{p.PLY_name}</strong></td>
                  <td>
                    {p.Team_name
                      ? <span className="badge badge-blue">{p.Team_name}</span>
                      : <span style={{ color: 'var(--muted)' }}>Unassigned</span>}
                  </td>
                  <td>
                    {p.Position
                      ? <span className={`badge ${posColors[p.Position] || 'badge-orange'}`}>{p.Position}</span>
                      : <span style={{ color: 'var(--muted)' }}>—</span>}
                  </td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.PLY_id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'EDIT PLAYER' : 'ADD PLAYER'} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Player Name *</label>
            <input placeholder="e.g. Rohit Verma" value={form.PLY_name}
              onChange={e => setForm({ ...form, PLY_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Team</label>
            <select value={form.Team_id} onChange={e => setForm({ ...form, Team_id: e.target.value })}>
              <option value="">— Select Team —</option>
              {teams.map(t => <option key={t.Team_id} value={t.Team_id}>{t.Team_name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Position</label>
            <select value={form.Position} onChange={e => setForm({ ...form, Position: e.target.value })}>
              <option value="">— Select Position —</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Add Player'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
