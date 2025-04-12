import { useState } from "react";
import { JsonToTsClass } from "../../utils/jsontoclass";
import './index.module.css'

const JsonToTsConverter = () => {
    const [jsonInput, setJsonInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");

    const handleConvert = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const converter = new JsonToTsClass("RootClass");
            const tsClasses = converter.convert(parsedJson);
            setOutput(tsClasses);
        } catch (error) {
            console.error(error)
            setOutput("Invalid JSON. Please check your input.");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        alert("Copied to clipboard!");
    };

    const Data = new RootClass({})
    
    console.log(Data.name,'>>>>>>');
    

    return (
        <div>
        <h1>JSON to TypeScript Class Converter </h1>
            < textarea
    placeholder = "Paste your JSON here..."
    value = { jsonInput }
    onChange = {(e) => setJsonInput(e.target.value)}
style = {{ width: "100%", height: "150px", margin: "10px 0" }}
      />
    < button onClick = { handleConvert } > Convert </button>
{
    output && (
        <div>
        <textarea
            value={ output }
    readOnly
    style = {{
        width: "100%",
            height: "300px",
                margin: "10px 0",
                    backgroundColor: "#f8f8f8",
            }
}
          />
    < button onClick = { handleCopy } > Copy </button>
        </div>
      )}
</div>
  );
};

export default JsonToTsConverter;


export class RootClass {
    name: string;

    constructor(data: any = {}) {
        this.name = data?.name ?? 'PW';
    }
}
