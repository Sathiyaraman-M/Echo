import React, {useCallback, useContext, useEffect, useState} from "react";
import {dialog} from "@tauri-apps/api";
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {useHotkeys} from "react-hotkeys-hook";
import SaveFileNameContext from "./contexts/SaveFileNameContext.ts";
import TaskListContext from "./contexts/TaskListContext.ts";
import {WebviewWindow} from "@tauri-apps/api/window";

const Toolbar = () => {
    const { taskList, setTaskList } = useContext(TaskListContext);
    const { saveFileName, setSaveFileName } = useContext(SaveFileNameContext);
    const [darkMode, setDarkMode] = useState(false);
    
    const handleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', darkMode ? 'light' : 'dark');
    }
    
    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') === 'dark');
    }, []);
    
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    }, [darkMode])
    
    const newFile =() => {
        const label = Date.now().toString();
        new WebviewWindow(label, {
            url: 'index.html',
            title: 'Echo JSON Editor',
            center: true,
        });
    }

    const openFile = useCallback(async () => {
        const selected = await dialog.open({filters: [{name: 'JSON', extensions: ['json']}], multiple: false}) as string;
        if (selected) {
            const fileContent = await readTextFile(selected);
            try {
                const data = JSON.parse(fileContent);
                setTaskList({ ...taskList, tasks: data });
                setSaveFileName(selected);
            } catch (e) {
                alert('Invalid JSON file');
            }
        }
    }, [taskList]);

    const saveToFile = useCallback(async () => {
        if (!saveFileName) {
            const selected = await dialog.save({filters: [{name: 'JSON', extensions: ['json']}]});
            if (selected) {
                const jsonData = JSON.stringify(taskList.tasks, null, 2);
                await writeFile({path: selected, contents: jsonData});
                setSaveFileName(selected);
            } else {
                alert('No file selected');
            }
        } else {
            const jsonData = JSON.stringify(taskList.tasks, null, 2);
            await writeFile({path: saveFileName, contents: jsonData});
        }
    }, [taskList, saveFileName])
    
    const saveToFileAs = useCallback(async () => {
        const selected = await dialog.save({filters: [{name: 'JSON', extensions: ['json']}]});
        if (selected) {
            const jsonData = JSON.stringify(taskList.tasks, null, 2);
            await writeFile({path: selected, contents: jsonData});
            setSaveFileName(selected);
        } else {
            alert('No file selected');
        }
    }, [taskList]);
    
    useHotkeys('ctrl+shift+n', async (event) => {
        event.preventDefault();
        newFile();
    });

    useHotkeys('ctrl+o', async (event) => {
        event.preventDefault();
        await openFile();
    }, [openFile]);

    useHotkeys('ctrl+s', async (event) => {
        event.preventDefault();
        await saveToFile();
    }, [saveToFile]);
    
    useHotkeys('ctrl+shift+s', async (event) => {
        event.preventDefault();
        await saveToFileAs();
    }, [saveToFileAs]);
    
    useEffect(() => {
        if (saveFileName) {
            sessionStorage.setItem('saveFileName', saveFileName);
        }
    }, [saveFileName]);
    
    useEffect(() => {
        if(!saveFileName) {
            const fileName = sessionStorage.getItem('saveFileName');
            if (fileName) {
                setSaveFileName(fileName);
                if (taskList.tasks.length === 0) {
                    readTextFile(fileName).then((fileContent) => {
                        try {
                            const data = JSON.parse(fileContent);
                            setTaskList({ ...taskList, tasks: data });
                        } catch (e) {
                            alert('Invalid JSON file');
                        }
                    });
                }
            }
        }
    })

    return (
        <div className="container-fluid my-2">
            <div className="d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between">
                <h3>Echo JSON Editor</h3>
                <div className="btn-toolbar gap-3" role="toolbar">
                    <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-primary" onClick={newFile}>
                            <i className="bi bi-file-earmark-plus me-2"></i>
                            New
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={openFile}>
                            <i className="bi bi-folder2-open me-2"></i>
                            Open
                        </button>
                        <button className="btn btn-sm btn-success" onClick={saveToFile}>
                            <i className="bi bi-floppy me-2"></i>
                            Save
                        </button>
                        <button className="btn btn-sm btn-info" onClick={saveToFileAs}>
                            <i className="bi bi-floppy-fill me-2"></i>
                            Save As
                        </button>
                    </div>
                    {darkMode ? 
                        <button className="btn btn-sm btn-secondary" onClick={handleDarkMode}>
                            <i className="bi bi-moon"></i>
                        </button> :
                        <button className="btn btn-sm btn-dark" onClick={handleDarkMode}>
                            <i className="bi bi-sun"></i>
                        </button>
                    }
                </div>
            </div>
        </div>
    )
}

export default Toolbar;