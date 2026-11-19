import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import { ToastProvider } from './context/ToastProvider.jsx'
import { ClosetProvider } from './context/ClosetProvider.jsx'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <ToastProvider>
          <ClosetProvider>
            <App />
          </ClosetProvider>
        </ToastProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)