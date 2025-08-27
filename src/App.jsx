import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import RingLoader from "react-spinners/RingLoader";

const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "typescript", label: "TypeScript" },
    { value: "rust", label: "Rust" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "perl", label: "Perl" },
    { value: "haskell", label: "Haskell" },
    { value: "elixir", label: "Elixir" },
    { value: "r", label: "R" },
    { value: "matlab", label: "MATLAB" },
    { value: "bash", label: "Bash" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyBmj0NQevzy7Pp9MRRyt_h2EQ_SKq2nttQ",
  });

  async function reviewCode() {
    if (!code.trim()) {
      alert("Please enter code first");
      return;
    }
    setResponse("");
    setLoading(true);

    try {
      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A clear explanation of what the code does, step by step.
4️⃣ A list of any potential bugs or logical errors, if found.
5️⃣ Identification of syntax errors or runtime errors, if present.
6️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code:
${code}
`,
      });

      setResponse(resp?.text || "No review returned");
    } catch (error) {
      setResponse("API error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      color: "#fff",
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      color: "#fff",
      width: "100%",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
      width: "100%",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#27272a" : "#18181b",
      color: "#fff",
      cursor: "pointer",
    }),
    input: (provided) => ({
      ...provided,
      color: "#000",
      width: "100%",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#000",
      width: "100%",
    }),
  };

  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[70px]">
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              styles={customStyles}
            />
            <button
              onClick={reviewCode}
              className="btnNormal bg-black min-w-[120px] transition-all hover:bg-zinc-800"
            >
              Review
            </button>
          </div>

          <Editor
            height="100%"
            language={selectedOption.value}
            value={code}
            onChange={(value) => setCode(value ?? "")}
            options={{
              overviewRulerBorder: false,
              overviewRulerLanes: 0,
              // Other props as needed
            }}
          />
        </div>

        <div className="right overflow-scroll !p-[10px] bg-white w-[50%] h-[101%]">
          <div className="topTab  flex items-center justify-center h-[60px] px-4">
            <div className="btnNormal bg-black min-w-[200px] transition-all hover:bg-zinc-800">
              <p1 className=" flex items-center justify-center font-[700] text-[15px]">
                Response
              </p1>{" "}
            </div>
          </div>
          <div className="flex items-center justify-center">
            {loading && <RingLoader color="#9333ea" />}{" "}
          </div>
          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  );
};

export default App;
