import React, {useCallback, useContext} from "react";
import {Status, Task} from "../../types/taskList.ts";
import TaskListContext from "./contexts/TaskListContext.tsx";


type TaskRowProps = {
    index: number;
    task: Task;
}

const TaskRow = (props: TaskRowProps) => {
    
    const {taskList, setTaskList} = useContext(TaskListContext);

    const updateRow = useCallback((task: Task) => {
        const newTasks = [...taskList.tasks];
        newTasks[props.index] = task;
        setTaskList({ ...taskList, tasks: newTasks });
    }, [taskList]);

    const deleteRow = useCallback(() => {
        const newTasks = [...taskList.tasks];
        newTasks.splice(props.index, 1);
        setTaskList({ ...taskList, tasks: newTasks });
    }, [taskList]);

    const swapRows = (index1: number, index2: number) => {
        if (index2 < 0 || index2 >= taskList.tasks.length) {
            return;
        }
        const newTasks = [...taskList.tasks];
        [newTasks[index1], newTasks[index2]] = [newTasks[index2], newTasks[index1]];
        setTaskList({ ...taskList, tasks: newTasks });
    }
    
    const moveUp = useCallback(() => {
        swapRows(props.index, props.index - 1);
    }, [props.index]);
    
    const moveDown = useCallback(() => {
        swapRows(props.index, props.index + 1);
    }, [props.index]);
        
    
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRow({ ...props.task, category: e.target.value });
    }
    
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateRow({ ...props.task, item: e.target.value });
    }
    
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value;
        if (status === Status.Backlog || status === Status.InProgress || status === Status.Done) {
            updateRow({ ...props.task, status: status });
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
                <button className={"btn btn-sm btn-action me-2" + `${props.index === 0 ? ' btn-secondary' : ' btn-primary'}`} 
                        onClick={moveUp} disabled={props.index === 0}>
                    <i className="bi bi-arrow-up"></i>
                </button>
                <button className={"btn btn-sm btn-action me-2" + `${props.index === taskList.tasks.length - 1 ? ' btn-secondary' : ' btn-primary'}`} 
                        onClick={moveDown} disabled={props.index === taskList.tasks.length - 1}>
                    <i className="bi bi-arrow-down"></i>
                </button>
                <button className="btn btn-sm btn-danger btn-action me-2" onClick={deleteRow}>
                    <i className="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    )
}

export default TaskRow;