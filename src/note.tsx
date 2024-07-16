import React from 'react';
import './style.css'
import {Container, createRoot} from "react-dom/client";
import Editor from "./Editor.tsx";

const root = createRoot(document.getElementById('root') as Container);
root.render(<Editor />);
