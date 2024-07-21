import React, {ReactNode, useEffect, useState} from "react";
import {TaskList} from "../../types/taskList.ts";
import TaskListContext from "./contexts/TaskListContext.ts";
import SaveFileNameContext from "./contexts/SaveFileNameContext.ts";
import CurrentRowContext from "./contexts/CurrentRowContext.ts";
import {CurrentRowRef} from "../../types/CurrentRowRef.ts";

const EditorProvider = ({children}: { children: ReactNode }) => {
    const [taskList, setTaskList] = useState<TaskList>({label: Date.now().toString(), name: '', tasks: []});
    const [saveFileName, setSaveFileName] = useState<string>("");
    const [currentRow, setCurrentRow] = useState<CurrentRowRef>({ rowIndex: -1, focusIndex: -1 });
    
    useEffect(() => {
        const saveFileName = sessionStorage.getItem('saveFileName');
        if (saveFileName) {
            setSaveFileName(saveFileName);
        }
    }, []);
    
    return (
        <TaskListContext.Provider value={{taskList, setTaskList}}>
            <SaveFileNameContext.Provider value={{saveFileName, setSaveFileName}}>
                <CurrentRowContext.Provider value={{currentRow, setCurrentRow}}>
                    {children}
                </CurrentRowContext.Provider>
            </SaveFileNameContext.Provider>
        </TaskListContext.Provider>
    )
}

export default EditorProvider;