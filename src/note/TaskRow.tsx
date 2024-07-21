import React, {SyntheticEvent, useCallback, useContext, useState} from "react";
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
    const [dropDownOpen, setDropDownOpen] = useState(false);

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
        setDropDownOpen(false);
    }, [currentRow, setCurrentRow, props.index]);

    const moveDown = useCallback(() => {
        if(currentRow.rowIndex === taskList.tasks.length - 1) {
            return;
        }
        if (currentRow.rowIndex === props.index) {
            swapRows(currentRow.rowIndex, currentRow.rowIndex + 1);
            setCurrentRow({ ...currentRow, rowIndex: currentRow.rowIndex + 1 });
        }
        setDropDownOpen(false);
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
    
    const handleSelectOption = (e: SyntheticEvent<HTMLUListElement>) => {
        e.target.dispatchEvent(new Event('click'))
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
                <div className="d-flex justify-content-start">
                    <div className="dropdown">
                        <button className={`btn btn-sm` + `${dropDownOpen ? ' show' : ''}`} 
                                onClick={() => setDropDownOpen(!dropDownOpen)}
                                onFocus={() => handleFocus(3)}>
                            <i className="bi bi-three-dots"></i>
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end` + `${dropDownOpen ? ' show' : ''}`}
                            onSelect={handleSelectOption}>
                            <li>
                                <a itemID={"move-up"} className={`dropdown-item ${props.index == 0 ? 'disabled' : ''}`} 
                                   onClick={moveUp}>
                                    <i className="bi bi-arrow-up"></i> Move Up
                                </a>
                            </li>
                            <li>
                                <a className={`dropdown-item ${props.index == taskList.tasks.length - 1 ? 'disabled' : ''}`} 
                                   onClick={moveDown}>
                                    <i className="bi bi-arrow-down"></i> Move Down
                                </a>
                            </li>
                            <div className="dropdown-divider"></div>
                            <li>
                                <a className="dropdown-item text-danger" onClick={deleteRow}>
                                    <i className="bi bi-trash-fill"></i> Delete
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </td>
        </tr>
    )
}

export default TaskRow;