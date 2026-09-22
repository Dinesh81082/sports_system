import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { coachesAPI, teamsAPI } from '../services/api'
import Modal from '../components/Modal'

const empty = { Coach_name: '', Team_id: '', Age: '', Experience: '' }

export default function Coaches() {
  const [coaches, setCoaches] = useState([])
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(empty)

  const load = () => {
    setLoading(true)
    Promise.all([coachesAPI.getAll(), teamsAPI.getAll()])
      .then(([c, t]) => { setCoaches(c.data); setTeams(t.data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit   = (c)  => {
    setEditing(c)
    setForm({ Coach_name: c.Coach_name, Team_id: c.Team_id || '', Age: c.Age || '', Experience: c.Experience || '' })
    setModal(true)
  }

  const handleSubmit = async () => {
    if (!form.Coach_name.trim()) return toast.error('Coach name is required')
    try {
      if (editing) {
        await coachesAPI.update(editing.Coach_id, form)
        toast.success('Coach updated!')
      } else {
        await coachesAPI.create(form)
        toast.success('Coach added!')
      }
      setModal(false); load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this coach?')) return
    try { await coachesAPI.remove(id); toast.success('Coach deleted'); load() }
    catch (e) { toast.error('Cannot delete') }
  }

  const expBadge = (exp) => {
    if (!exp) return null
    if (exp >= 15) return <span className="badge badge-orange">⭐ Veteran</span>
    if (exp >= 8)  return <span className="badge badge-blue">🎯 Senior</span>
    return <span className="badge badge-green">🌱 Junior</span>
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">COA<span>CHES</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Coach</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h2>All Coaches</h2>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{coaches.length} total</span>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : coaches.length === 0 ? (
          <div className="empty"><div className="empty-icon">🎯</div><p>No coaches found. Add one!</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Coach Name</th>
                <th>Team</th>
                <th>Age</th>
                <th>Experience</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coaches.map((c, i) => (
                <tr key={c.Coach_id}>
                  <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                  <td><strong>{c.Coach_name}</strong></td>
                  <td>
                    {c.Team_name
                      ? <span className="badge badge-blue">{c.Team_name}</span>
                      : <span style={{ color: 'var(--muted)' }}>Unassigned</span>}
                  </td>
                  <td>{c.Age ? `${c.Age} yrs` : '—'}</td>
                  <td>{c.Experience ? `${c.Experience} yrs` : '—'}</td>
                  <td>{expBadge(c.Experience)}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(c)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.Coach_id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'EDIT COACH' : 'ADD COACH'} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Coach Name *</label>
            <input placeholder="e.g. Rahul Sharma" value={form.Coach_name}
              onChange={e => setForm({ ...form, Coach_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Assign Team</label>
            <select value={form.Team_id} onChange={e => setForm({ ...form, Team_id: e.target.value })}>
              <option value="">— Select Team —</option>
              {teams.map(t => <option key={t.Team_id} value={t.Team_id}>{t.Team_name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="e.g. 45" value={form.Age}
                onChange={e => setForm({ ...form, Age: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Experience (yrs)</label>
              <input type="number" placeholder="e.g. 12" value={form.Experience}
                onChange={e => setForm({ ...form, Experience: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Add Coach'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
