export type TaskList = {
    label: string;
    name: string;
    description?: string;
    tasks: Task[];
}

export type Task = {
    category: string;
    item: string;
    status: Status;
}

export enum Status {
    Done = 'done',
    InProgress = 'in-progress',
    Backlog = 'backlog'
}

