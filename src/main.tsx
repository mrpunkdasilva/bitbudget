import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.scss'
import reportWebVitals from './reportWebVitals'
import { AppProviders } from './contexts/AppProviders'

// Easter egg no console
console.log(`%c
██████╗ ██╗████████╗██████╗ ██╗   ██╗██████╗  ██████╗ ███████╗████████╗
██╔══██╗██║╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔════╝ ██╔════╝╚══██╔══╝
██████╔╝██║   ██║   ██████╔╝██║   ██║██║  ██║██║  ███╗█████╗     ██║   
██╔══██╗██║   ██║   ██╔══██╗██║   ██║██║  ██║██║   ██║██╔══╝     ██║   
██████╔╝██║   ██║   ██████╔╝╚██████╔╝██████╔╝╚██████╔╝███████╗   ██║   
╚═════╝ ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝   ╚═╝   
                                                                        
`, 'color: #8a2be2; font-weight: bold;');
console.log('%cControle suas finanças com estilo retrô!', 'color: #00b4d8; font-size: 14px;');

const root = document.getElementById('root') as HTMLElement
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </React.StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()