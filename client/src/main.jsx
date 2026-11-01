import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Clear any stale overflow lock that might have persisted in DOM
if (typeof document !== 'undefined') {
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
