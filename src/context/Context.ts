import { createContext, Dispatch } from "react";

// Define the shape of the context value
export interface ContextValue {
    onSent?: (prompt?:string) => Promise<void>;
    setInput?: Dispatch<React.SetStateAction<string>>;
    input?:string
    setRecentPrompt?: Dispatch<React.SetStateAction<string>>;
    recentPrompt?: string;
    setPrevPrompts?: Dispatch<React.SetStateAction<string[]>>;
    prevPrompts?: string[];
    setLoading?: Dispatch<React.SetStateAction<boolean>>;
    loading?: boolean;
    showResult?: boolean;
    resultData?: string
    newChat?:()=>void
}

// Create a context with the defined type
export const Context = createContext<ContextValue>({});


// onSent,
//     setInput,
//     input,
//     setRecentPrompt,
//     recentPrompt,
//     setPrevPrompts,
//     prevPrompts,
//     showResult
// setLoading,
//     loading,
//     resultData