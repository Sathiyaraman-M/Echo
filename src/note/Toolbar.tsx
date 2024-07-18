import React, {useCallback, useContext} from "react";
import {Status} from "../../types/taskList.ts";
import {dialog} from "@tauri-apps/api";
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import {useHotkeys} from "react-hotkeys-hook";
import SaveFileNameContext from "./contexts/SaveFileNameContext.tsx";
import TaskListContext from "./contexts/TaskListContext.tsx";

const Toolbar = () => {
    const { taskList, setTaskList } = useContext(TaskListContext);
    const { saveFileName, setSaveFileName } = useContext(SaveFileNameContext);

    const addRow = useCallback(() => {
        const newTask = { category: '', item: '', status: Status.Backlog };
        setTaskList({ ...taskList, tasks: [...taskList.tasks, newTask] });
    }, [taskList]);

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
    }, [taskList, saveFileName]);

    useHotkeys('ctrl+n', (event) => {
        event.preventDefault();
        addRow();
    }, [addRow]);

    useHotkeys('ctrl+o', async (event) => {
        event.preventDefault();
        await openFile();
    }, [openFile]);

    useHotkeys('ctrl+s', async (event) => {
        event.preventDefault();
        await saveToFile();
    }, [saveToFile]);

    return (
        <div className="container-fluid my-2">
            <div className="d-flex flex-wrap flex-lg-nowrap align-items-center justify-content-between">
                <h3>Echo JSON Editor</h3>
                <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-primary" onClick={addRow}>
                        <i className="bi bi-plus-lg"></i>
                        Add Row
                    </button>
                    <button className="btn btn-sm btn-secondary" onClick={openFile}>
                        <i className="bi bi-folder2-open me-1"></i>
                        Open File
                    </button>
                    <button className="btn btn-sm btn-success" onClick={saveToFile}>
                        <i className="bi bi-file-earmark-arrow-down me-1"></i>
                        Save To File
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Toolbar;