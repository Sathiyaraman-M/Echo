import {createContext} from "react";

type SaveFileNameContextType = {
    saveFileName: string;
    setSaveFileName: (saveFileName: string) => void;

}

const SaveFileNameContext = createContext<SaveFileNameContextType>({
    saveFileName: '', setSaveFileName: () => {}
});

export default SaveFileNameContext;