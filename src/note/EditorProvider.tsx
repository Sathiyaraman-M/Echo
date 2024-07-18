import React, {ReactNode, useState} from "react";
import {TaskList} from "../../types/taskList.ts";
import TaskListContext from "./contexts/TaskListContext.tsx";
import SaveFileNameContext from "./contexts/SaveFileNameContext.tsx";

const EditorProvider = ({children}: { children: ReactNode }) => {
    const [taskList, setTaskList] = useState<TaskList>({label: Date.now().toString(), name: '', tasks: []});
    const [saveFileName, setSaveFileName] = useState<string>("");
    return (
        <TaskListContext.Provider value={{taskList, setTaskList}}>
            <SaveFileNameContext.Provider value={{saveFileName, setSaveFileName}}>
                {children}
            </SaveFileNameContext.Provider>
        </TaskListContext.Provider>
    )
}

export default EditorProvider;