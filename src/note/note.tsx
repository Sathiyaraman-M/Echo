import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../style.css';
import {Container, createRoot} from "react-dom/client";
import Editor from "./Editor.tsx";
import EditorProvider from "./EditorProvider.tsx";

const root = createRoot(document.getElementById('root') as Container);``
root.render(
    <EditorProvider>
        <Editor />
    </EditorProvider>
);
