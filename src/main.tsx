import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './sass/bootstrap-custom.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ConfigProvider } from './providers/ConfigProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider>
            <App />
        </ConfigProvider>
    </StrictMode>,
)
