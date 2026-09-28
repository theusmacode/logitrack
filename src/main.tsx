import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.tsx'
import { ToastProvider } from './context/ToastContext'
import ToastStack from './components/ui/ToastStack'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
        <ToastStack />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
