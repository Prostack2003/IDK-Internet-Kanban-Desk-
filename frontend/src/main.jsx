import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { Toaster } from 'sonner'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ChakraProvider>
            <CSSReset />
            <App />
            <Toaster position="bottom-right" richColors />
        </ChakraProvider>
    </React.StrictMode>,
)
