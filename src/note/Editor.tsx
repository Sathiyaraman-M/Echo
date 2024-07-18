import React, {useContext} from "react";
import TaskRow from "./TaskRow.tsx";
import Toolbar from "./Toolbar.tsx";
import TaskListContext from "./contexts/TaskListContext.tsx";

const Editor = () => {
    
    const {taskList} = useContext(TaskListContext);
    
    return (
        <>
            <Toolbar />
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
                        <TaskRow index={index} task={task} />
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Editor;