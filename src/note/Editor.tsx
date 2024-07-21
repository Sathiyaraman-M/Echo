import React, {useCallback, useContext} from "react";
import TaskRow from "./TaskRow.tsx";
import Toolbar from "./Toolbar.tsx";
import TaskListContext from "./contexts/TaskListContext.ts";
import {Status} from "../../types/taskList.ts";
import {useHotkeys} from "react-hotkeys-hook";
import SaveFileNameContext from "./contexts/SaveFileNameContext.ts";
import {getCurrent} from "@tauri-apps/api/window";

const Editor = () => {
    
    const {taskList, setTaskList} = useContext(TaskListContext);
    
    const {saveFileName} = useContext(SaveFileNameContext);
    
    const closeWindow = useCallback(async (forceClose = false) => {
        const currentWindow = getCurrent();
        if (!forceClose) {
            if (!saveFileName) {
                if (taskList.tasks.length > 0) {
                    alert('Please save the file first. Else force close the window with Ctrl+Shift+W');
                    return;
                }
            }
        }
        await currentWindow.close();
    }, [saveFileName, taskList]);

    const insertNewRow = useCallback(() => {
        const newTask = { category: '', item: '', status: Status.Backlog };
        setTaskList({ ...taskList, tasks: [...taskList.tasks, newTask] });
    }, [taskList]);
    
    useHotkeys('ctrl+w', async (event) => {
        event.preventDefault();
        await closeWindow();
    }, [closeWindow]);
    
    useHotkeys('ctrl+shift+w', async (event) => {
        event.preventDefault();
        await closeWindow(true);
    }, [closeWindow]);

    useHotkeys('ctrl+n', (event) => {
        event.preventDefault();
        insertNewRow();
    }, [insertNewRow]);
    
    return (
        <>
            <Toolbar />
            <div className="table-responsive">
                <table className="table table-bordered mt-2">
                    <colgroup>
                        <col style={{width: "20%"}}/>
                        <col style={{width: "50%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "15%"}}/>
                    </colgroup>
                    <thead>
                        <tr className="table-primary">
                            <th>CATEGORY</th>
                            <th>ITEM</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                    {taskList.tasks.map((task, index) => 
                        <TaskRow key={index} index={index} task={task} />
                    )}
                    </tbody>
                </table>
            </div>
            <button className="btn btn-sm w-100 text-start" onClick={insertNewRow} style={{marginTop: "-2rem"}}>
                <i className="bi bi-plus-lg me-1"></i>
                Row
            </button>
        </>
    );
}

export default Editor;