import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar    from './components/Sidebar'
import Dashboard  from './pages/Dashboard'
import Teams      from './pages/Teams'
import Players    from './pages/Players'
import Coaches    from './pages/Coaches'
import Matches    from './pages/Matches'
import Scores     from './pages/Scores'

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/"        element={<Dashboard />} />
          <Route path="/teams"   element={<Teams />}     />
          <Route path="/players" element={<Players />}   />
          <Route path="/coaches" element={<Coaches />}   />
          <Route path="/matches" element={<Matches />}   />
          <Route path="/scores"  element={<Scores />}    />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111827',
            color: '#e2e8f0',
            border: '1px solid #1e2d4a',
            fontFamily: 'DM Sans, sans-serif'
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#111827' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#111827' } },
        }}
      />
    </div>
  )
}
