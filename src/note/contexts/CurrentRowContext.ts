import {createContext} from "react";
import {CurrentRowRef} from "../../../types/CurrentRowRef.ts";

type CurrentRowContextType = {
    currentRow: CurrentRowRef;
    setCurrentRow: (currentRow: CurrentRowRef) => void;
}

const CurrentRowContext = createContext<CurrentRowContextType>({ currentRow: { rowIndex: -1, focusIndex: -1 }, setCurrentRow: () => {} });

export default CurrentRowContext;