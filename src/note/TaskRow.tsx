import React, {useCallback, useContext} from "react";
import {Status, Task} from "../../types/taskList.ts";
import TaskListContext from "./contexts/TaskListContext.ts";
import CurrentRowContext from "./contexts/CurrentRowContext.ts";
import {useHotkeys} from "react-hotkeys-hook";

type TaskRowProps = {
    index: number;
    task: Task;
}

const TaskRow = (props: TaskRowProps) => {

    const {taskList, setTaskList} = useContext(TaskListContext);
    const {currentRow, setCurrentRow} = useContext(CurrentRowContext);

    const handleFocus = (focusIndex: number) => {
        setCurrentRow({ rowIndex: props.index, focusIndex: focusIndex });    
    }

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
        const newTasks = [...taskList.tasks];
        [newTasks[index1], newTasks[index2]] = [newTasks[index2], newTasks[index1]];
        setTaskList({ ...taskList, tasks: newTasks });
    }

    const moveUp = useCallback(() => {
        if(currentRow.rowIndex === 0) {
            return;
        }
        if (currentRow.rowIndex === props.index) {
            swapRows(currentRow.rowIndex, currentRow.rowIndex - 1);
            setCurrentRow({ ...currentRow, rowIndex: currentRow.rowIndex - 1 });
        }
    }, [currentRow, setCurrentRow, props.index]);
    
    const moveDown = useCallback(() => {
        if(currentRow.rowIndex === taskList.tasks.length - 1) {
            return;
        }
        if (currentRow.rowIndex === props.index) {
            swapRows(currentRow.rowIndex, currentRow.rowIndex + 1);
            setCurrentRow({ ...currentRow, rowIndex: currentRow.rowIndex + 1 });
        }
    }, [currentRow, setCurrentRow, props.index]);

    useHotkeys('ctrl+up', (event: KeyboardEvent) => {
        event.preventDefault();
        moveUp();
    }, { enabled: currentRow.rowIndex === props.index }, [moveUp]);

    useHotkeys('ctrl+down', (event: KeyboardEvent) => {
        event.preventDefault();
        moveDown();
    }, { enabled: currentRow.rowIndex === props.index }, [moveDown]);

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
                       value={props.task.category} onFocus={() => handleFocus(0)} onChange={handleCategoryChange} />
            </td>
            <td className="table-input">
                <input type="text" className="table-cell form-control form-control-sm"
                       value={props.task.item} onFocus={() => handleFocus(1)} onChange={handleItemChange}/></td>
            <td className="table-input">
                <select className="table-cell form-select form-select-sm"
                        value={props.task.status} onFocus={() => handleFocus(2)} onChange={handleStatusChange}>
                    <option value="backlog">Backlog</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </td>
            <td className="table-row-actions">
                <button className={"btn btn-sm btn-action me-2" + `${props.index === 0 ? ' btn-secondary' : ' btn-primary'}`} 
                        onClick={moveUp} disabled={props.index === 0} onFocus={() => handleFocus(3)}>
                    <i className="bi bi-arrow-up"></i>
                </button>
                <button className={"btn btn-sm btn-action me-2" + `${props.index === taskList.tasks.length - 1 ? ' btn-secondary' : ' btn-primary'}`} 
                        onClick={moveDown} disabled={props.index === taskList.tasks.length - 1} onFocus={() => handleFocus(4)}>
                    <i className="bi bi-arrow-down"></i>
                </button>
                <button className="btn btn-sm btn-danger btn-action me-2" onClick={deleteRow} onFocus={() => handleFocus(5)}>
                    <i className="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    )
}

export default TaskRow;