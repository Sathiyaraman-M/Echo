import {TaskList} from "../../types/taskList.ts";
import React from "react";

type TaskListProps = {
    taskLists: TaskList[];
    onUpdate: (taskList: TaskList) => void;
    onDelete: (taskList: TaskList) => void;
}

const TaskLists = (props: TaskListProps) => {
    
    return (
        <div>
            {props.taskLists.map((taskList) => (
                <div key={taskList.label} className="card mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <h5>{taskList.name}</h5>
                        <div>
                            <button className="btn btn-sm btn-primary me-2">Add Task</button>
                            <button className="btn btn-sm btn-secondary me-2">Export</button>
                            <button className="btn btn-sm btn-danger" onClick={() => props.onDelete(taskList)}>Delete</button>
                        </div>
                    </div>
                    <div className="card-body">
                        <ul className="list-group">
                            {taskList.tasks.map((task) => (
                                <li key={task.item} className="list-group-item d-flex justify-content-between">
                                    <div>
                                        <strong>{task.item}</strong>
                                        <span className="badge bg-info ms-2">{task.category}</span>
                                    </div>
                                    <div>
                                        <button className="btn btn-sm btn-primary me-2">Edit</button>
                                        <button className="btn btn-sm btn-danger">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TaskLists;