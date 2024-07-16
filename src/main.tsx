import React from 'react';
import './style.css'
import App from './App';
import {Container, createRoot} from "react-dom/client";

const root = createRoot(document.getElementById('root') as Container);
root.render(<App />);
