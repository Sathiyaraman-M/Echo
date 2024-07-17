import React, {useState} from "react";
import {Status, Task, TaskList} from "../../types/taskList.ts";
import {dialog} from "@tauri-apps/api";
import {readTextFile, writeFile} from "@tauri-apps/api/fs";
import TaskRow from "./TaskRow.tsx";

const Editor = () => {
    
    const [saveFileName, setSaveFileName] = useState<string>();
    
    const [taskList, setTaskList] = useState<TaskList>({
        label: Date.now().toString(),
        name: 'New Task List',
        tasks: []
    });
    
    const addRow = () => {
        const newTask = { category: '', item: '', status: Status.Backlog };
        setTaskList({ ...taskList, tasks: [...taskList.tasks, newTask] });
    }
    
    const updateRow = (index: number, task: Task) => {
        const newTasks = [...taskList.tasks];
        newTasks[index] = task;
        setTaskList({ ...taskList, tasks: newTasks });
    }
    
    const deleteRow = (index: number) => {
        const newTasks = [...taskList.tasks];
        newTasks.splice(index, 1);
        setTaskList({ ...taskList, tasks: newTasks });
    }
    
    const swapRows = (index1: number, index2: number) => {
        const newTasks = [...taskList.tasks];
        const temp = newTasks[index1];
        newTasks[index1] = newTasks[index2];
        newTasks[index2] = temp;
        setTaskList({ ...taskList, tasks: newTasks });
    }
    
    const openFile = async () => {
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
    }
    
    const saveToFile = async () => {
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
    }
    
    return (
        <>
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
                        <button className="btn btn-sm btn-secondary" onClick={saveToFile}>
                            <i className="bi bi-file-earmark-arrow-down me-1"></i>
                            Save To File
                        </button>
                    </div>
                </div>
            </div>
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
                        <TaskRow key={index}
                            index={index} 
                            task={task} 
                            onUpdate={(task) => updateRow(index,  task)} 
                            onDelete={() => deleteRow(index)}
                            moveUp={() => swapRows(index, index - 1)}
                            moveDown={() => swapRows(index, index + 1)}/>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Editor;