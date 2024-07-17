import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../style.css'
import App from './App.tsx';
import {Container, createRoot} from "react-dom/client";

const root = createRoot(document.getElementById('root') as Container);
root.render(<App />);
