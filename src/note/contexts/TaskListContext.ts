import {TaskList} from "../../../types/taskList.ts";
import {createContext} from "react";

type TaskListContextType = {
    taskList: TaskList;
    setTaskList: (taskList: TaskList) => void;
}

const TaskListContext = createContext<TaskListContextType>({
    taskList: {label: '', name: '', tasks: []},
    setTaskList: () => {}
});

export default TaskListContext;
