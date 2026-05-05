import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App      from './App.jsx'
import AdminApp from './components/admin/AdminApp.jsx'

// Routing simple : /admin → espace admin, tout le reste → site vitrine
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)
