import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './sass/bootstrap-custom.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ConfigProvider } from './providers/ConfigProvider.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(far, fas)

createRoot(document.getElementById('root')!).render(
    <ConfigProvider>
        <App />
    </ConfigProvider>,
)
