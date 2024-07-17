import React from "react";
import {Status, Task} from "../../types/taskList.ts";


type TaskRowProps = {
    index: number;
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: () => void;
    moveUp: () => void;
    moveDown: () => void;
}

const TaskRow = (props: TaskRowProps) => {
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onUpdate({ ...props.task, category: e.target.value });
    }
    
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onUpdate({ ...props.task, item: e.target.value });
    }
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        if (status === Status.Backlog || status === Status.InProgress || status === Status.Done) {
            props.onUpdate({ ...props.task, status: status });
        }
    }
    
    return (
        <tr className="table-input-row" key={props.index}>
            <td className="table-input">
                <input type="text" className="table-cell form-control form-control-sm" 
                       value={props.task.category} onChange={handleCategoryChange} />
            </td>
            <td className="table-input">
                <input type="text" className="table-cell form-control form-control-sm" 
                       value={props.task.item} onChange={handleItemChange}/></td>
            <td className="table-input">
                <select className="table-cell form-select form-select-sm" 
                        value={props.task.status} onChange={handleStatusChange}>
                    <option value="backlog">Backlog</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </td>
            <td className="table-row-actions">
                <button className="btn btn-sm btn-primary btn-action me-2" onClick={props.moveUp}>
                    <i className="bi bi-arrow-up"></i>
                </button>
                <button className="btn btn-sm btn-primary btn-action me-2" onClick={props.moveDown}>
                    <i className="bi bi-arrow-down"></i>
                </button>
                <button className="btn btn-sm btn-danger btn-action me-2" onClick={props.onDelete}>
                    <i className="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    )
}

export default TaskRow;