import { ReactNode, useState } from "react";
import runGemini from "../config/gemini";
import { Context, ContextValue } from "./Context";




// Define props for the ContextProvider
interface ContextProviderProps {
    children: ReactNode; // Allows passing React components as children
}

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {

    const [input, setInput] = useState("")
    const [recentPrompt, setRecentPrompt] = useState("")
    const [prevPrompts, setPrevPrompts] = useState<string[]>([])
    const [showResult, setShowResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resultData, setResultData] = useState("")

    const delayPara = (index:number,nextWord:string) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord)
        },75*index)
    }
    
    const newChat = () => {
        setLoading(false)
        setShowResult(false)
        setInput('')
    }

    const onSent = async (prompt?: string) => {
        const inputData=prompt?prompt:input
        setResultData("")
        setLoading(true)
        setShowResult(true)
        setRecentPrompt(inputData)
        if (prompt) {
            setPrevPrompts(prev => [inputData,...prev.filter((item)=>item!==prompt)])
        } else {
            setPrevPrompts(prev => [inputData, ...prev]) 
        }
        const res = await runGemini(inputData);
        const resArray = res.split("**")
        let newRes='';
        for (let i = 0; i < resArray.length; i++){
            if (i === 0 || i % 2 !== 1) {
                if (resArray[i]) {
                    newRes += resArray[i]
                }
            } else {
                if (resArray[i]) {
                    newRes += "<b>"+resArray[i]+"</b>"
                }
            }
        }
        const newRes2 = newRes.split("*")?.join("</br>")
        const newResArray = newRes2.split(" ")
        for (let i = 0; i < newResArray.length; i++){
            const nextWord = newResArray[i]
            delayPara(i,nextWord+" ")
        }
        setLoading(false)
        setInput('')
    };

  

    const contextValue: ContextValue = {
        onSent,
        setInput,
        input,
        setRecentPrompt,
        recentPrompt,
        setPrevPrompts,
        prevPrompts,
        showResult,
        setLoading,
        loading,
        resultData,
        newChat
    };

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider
