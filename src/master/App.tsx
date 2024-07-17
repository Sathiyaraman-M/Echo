import React, {useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/window";
import {TaskList} from "../../types/taskList.ts";
import TaskLists from "../note/TaskLists.tsx";

const App = () => {
    
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);

    const createNewNote = async () => {
        const label = Date.now().toString();
        const taskList = { label: label, name: 'New Task List', tasks: [] };
        setTaskLists([...taskLists, taskList]);
        new WebviewWindow(taskList.label,{
            url: 'note.html',
            title: 'New Task List',
            center: true,
        });
    };
    
    const updateTaskList = (taskList: TaskList) => {
        setTaskLists(taskLists.map((t) => t.label === taskList.label ? taskList : t));
    }
    
    const deleteTaskList = (taskList: TaskList) => {
        setTaskLists(taskLists.filter((t) => t.label !== taskList.label));
    }
    
    return (
        <div className="container mt-4">
            <h1 className="mb-4">Task List Manager</h1>
            <div className="mb-4">
                <button className="btn btn-primary me-2" onClick={createNewNote}>
                    Create New Task List
                </button>
                <button className="btn btn-info me-2">Import Task List</button>
                <button className="btn btn-secondary me-2">Export Task Lists</button>
            </div>
            <TaskLists taskLists={taskLists} onUpdateTaskList={updateTaskList} onDeleteTaskList={deleteTaskList} />
        </div>
    )
}

export default App;