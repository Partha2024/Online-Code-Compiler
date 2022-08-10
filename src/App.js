import React, { useState } from 'react'
import "./App.css"

export default function App() {

    const [langId, setlangId] = useState(54);
    const [input, setInput] = useState();
    const [userInput, setUserInput] = useState();
    const [userOutput, setUserOutput] = useState();
    
    let submit = async() => {
        let outputText = document.getElementById("output");
        outputText.innerHTML = "";
        outputText.innerHTML = "Compiling...\n";
        console.log("POST")

        const response = await fetch(`https://judge0-ce.p.rapidapi.com/submissions`,
            {
                method: "POST",
                headers: {
                    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                    "x-rapidapi-key": "74bf99fc21msh2b4ff766e24ca83p1c722cjsn261aedcec40b", //Confidencial🔐
                    'content-type': 'application/json',
                    'Content-Type': 'application/json',
                    accept: "application/json",
                },
                body: JSON.stringify({
                    source_code: input,
                    stdin: userInput,
                    language_id: langId,
                }),
            }
        );

        const jsonResponse = await response.json();

        let jsonGetSolution = {
            status: { description: "Please Wait" },
            stderr: null,
            compile_output: null,
        };

        while(jsonGetSolution.status.description !== "Accepted" && jsonGetSolution.stderr == null && jsonGetSolution.compile_output == null){
            if (jsonResponse.token) {
                console.log("GET")
                let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true&fields=*`
                const getSolution = await fetch(url, {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                        "x-rapidapi-key": "74bf99fc21msh2b4ff766e24ca83p1c722cjsn261aedcec40b", //Confidencial🔐
                    },
                });
                jsonGetSolution = await getSolution.json();
            }
        }

        if(jsonGetSolution.stdout){
            let result = "";
            const uO = userOutput;
            const output = atob(jsonGetSolution.stdout);

            if(output !== uO){
                result = "Wrong : Output Dosen't Matches With Expected Output";
            }else{
                result = "Correct : Output Matches With Expected Output ";
            }

            outputText.innerHTML = "";
            outputText.innerHTML += `${output}\n\n\n\nExecution Time Taken : ${jsonGetSolution.time} Secs.\nMemory used : ${jsonGetSolution.memory} bytes \n\n${result}`;
        }else if(jsonGetSolution.stderr) {
            const error = atob(jsonGetSolution.stderr);
            outputText.innerHTML = "";
            outputText.innerHTML += `\n Error :${error}`;
        }else{
            const compilation_error = atob(jsonGetSolution.compile_output);
            outputText.innerHTML = "";
            outputText.innerHTML += `\n Error :${compilation_error}`;
        }
    };

    return (
        <div id='main'>

            <div className="header">  
                <span className="heading">Online Code Editor</span>
                <span className="language">
                    <label htmlFor="tags" className="lang"><b>Language:</b></label>
                    <select value={langId} onChange={e => setlangId(e.target.value)} id="tags">
                        <option value="54">C++</option>
                        <option value="50">C</option>
                        <option value="62">Java</option>
                        <option value="71">Python</option>
                    </select>
                </span>
                <button type="submit" className="runBtn" onClick={()=>submit()}>Run</button>
            </div>

            <div className='sides'>
                <div className='leftSide'>        
                    <p className='sideTitle ide'>Code</p> 
                    <textarea id="codeTextArea" required name="solution" onChange={e => setInput(e.target.value)} 
                        value={input} placeholder = "Write Your Code Here">
                    </textarea>
                </div>

                <div className='rightSide'>
                    <p className='sideTitle out'>Output</p>
                    <textarea id="output" readOnly></textarea>

                    <span id="titleSpan">
                        <p className='sideTitle inp'>Input</p>
                        <p className='sideTitle exOut'>Expected Output</p>
                    </span>

                    <div id="inputArea">
                        <textarea id="userInput" onChange={e => setUserInput(e.target.value)} placeholder = "Enter Input Here"></textarea>
                        <textarea id="userOutput" onChange={e => setUserOutput(e.target.value)} placeholder = "Enter Expected Output Here"></textarea>
                    </div>
                    
                </div>

            </div>
        </div>
    )
}