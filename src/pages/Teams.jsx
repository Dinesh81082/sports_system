import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { teamsAPI } from '../services/api'
import Modal from '../components/Modal'

const empty = { Team_name: '', Coach_name: '', Home_ground: '' }

export default function Teams() {
  const [teams, setTeams]     = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(empty)

  const load = () => {
    setLoading(true)
    teamsAPI.getAll()
      .then(r => setTeams(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit   = (t)  => { setEditing(t); setForm({ Team_name: t.Team_name, Coach_name: t.Coach_name, Home_ground: t.Home_ground }); setModal(true) }

  const handleSubmit = async () => {
    if (!form.Team_name.trim()) return toast.error('Team name is required')
    try {
      if (editing) {
        await teamsAPI.update(editing.Team_id, form)
        toast.success('Team updated!')
      } else {
        await teamsAPI.create(form)
        toast.success('Team created!')
      }
      setModal(false); load()
    } catch (e) { toast.error(e.response?.data?.error || 'Error occurred') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this team?')) return
    try {
      await teamsAPI.remove(id)
      toast.success('Team deleted')
      load()
    } catch (e) { toast.error(e.response?.data?.error || 'Cannot delete') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">TEA<span>MS</span></h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Team</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <h2>All Teams</h2>
          <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{teams.length} total</span>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /><span>Loading...</span></div>
        ) : teams.length === 0 ? (
          <div className="empty"><div className="empty-icon">🛡️</div><p>No teams found. Add one!</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Team Name</th>
                <th>Coach</th>
                <th>Home Ground</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, i) => (
                <tr key={t.Team_id}>
                  <td style={{ color: 'var(--muted)' }}>{i + 1}</td>
                  <td><strong>{t.Team_name}</strong></td>
                  <td>{t.Coach_name || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                  <td>{t.Home_ground || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-edit btn-sm" onClick={() => openEdit(t)}>✏️ Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.Team_id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={editing ? 'EDIT TEAM' : 'ADD TEAM'} onClose={() => setModal(false)}>
          <div className="form-group">
            <label>Team Name *</label>
            <input placeholder="e.g. Mumbai Warriors" value={form.Team_name}
              onChange={e => setForm({ ...form, Team_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Coach Name</label>
            <input placeholder="e.g. Rahul Sharma" value={form.Coach_name}
              onChange={e => setForm({ ...form, Coach_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Home Ground</label>
            <input placeholder="e.g. Wankhede Stadium" value={form.Home_ground}
              onChange={e => setForm({ ...form, Home_ground: e.target.value })} />
          </div>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editing ? 'Save Changes' : 'Create Team'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
