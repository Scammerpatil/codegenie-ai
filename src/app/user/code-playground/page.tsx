"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { IconPlayerPlay, IconTrash, IconCode } from "@tabler/icons-react";
import AnsiToHtml from "ansi-to-html";
import Title from "@/components/Title";
import axios from "axios";
import toast from "react-hot-toast";
import { analyzeCode } from "./codeAnalyzer";
import { useAuth } from "@/context/AuthContext";
import { registerCopilot } from "monacopilot";

export default function CodePlayground() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("python");
  const [theme, setTheme] = useState("vs-dark");
  const [code, setCode] = useState(
    "# Write your Python code here\nprint('Hello CodeGenie!')"
  );
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const defaultCodes: { [key: string]: string } = {
      python: "# Write your Python code here\nprint('Hello CodeGenie!')",
      javascript:
        "// Write your JavaScript code here\nconsole.log('Hello CodeGenie!');",
      java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello CodeGenie!");
    }
}`,
      cpp: `// Write your C++ code here
#include <iostream>
int main() {
    std::cout << "Hello CodeGenie!" << std::endl;
    return 0;
}`,
      c: `// Write your C code here
#include <stdio.h>
int main() {
    printf("Hello CodeGenie!\\n");
    return 0;
}`,
    };
    setOutput(null);
    setCode(defaultCodes[language]);
  }, [language]);

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Handle editor mount
  const handleEditorDidMount = async (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    });

    // Register languages
    monaco.languages.register({ id: "java" });
    monaco.languages.register({ id: "python" });
    monaco.languages.register({ id: "cpp" });
    monaco.languages.register({ id: "c" });

    // Optionally, connect to LSP servers here
    // await connectToLsp(monaco, language);
  };

  // Run code
  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);
    try {
      const response = axios.post("/api/code/run", { language, code });
      toast.promise(response, {
        loading: "Running code...",
        success: (res) => {
          const converter = new AnsiToHtml();
          setOutput(converter.toHtml(res.data.output));
          console.log("Code run output:", res.data);
          return "Code executed successfully!";
        },
        error: (err) => {
          setOutput(`❌ Error: ${err.response?.data?.error || err.message}`);
          return "Error executing code";
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    setCode("");
    setOutput(null);
  };

  const handleCopilotMount = (editor: any, monaco: Monaco) => {
    registerCopilot(monaco, editor, {
      endpoint: "/api/code/copilot",
      language: language,
    });
  };

  return (
    <>
      <Title
        title={"Code Playground"}
        icon={<IconCode size={28} />}
        subtitle="Write, debug, and run your code here."
      >
        <div className="flex flex-row gap-3 w-1/2">
          <select
            className="select select-bordered"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {["vs", "vs-dark", "hc-black", "hc-light"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <select
            className="select select-bordered"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>
      </Title>

      <div className="space-y-4">
        <div className="border border-primary p-4 bg-base-200 rounded-md">
          <div className="flex justify-end gap-2 mb-4">
            <button
              className="btn btn-accent btn-sm"
              title="Code Copilot"
              onClick={() => {
                if (editorRef.current && monacoRef.current) {
                  handleCopilotMount(editorRef.current, monacoRef.current);
                }
              }}
            >
              <IconCode size={14} />
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={runCode}
              disabled={isRunning}
            >
              <IconPlayerPlay size={14} />
            </button>
            <button className="btn btn-error btn-sm" onClick={clearCode}>
              <IconTrash size={14} />
            </button>
          </div>

          <Editor
            height="400px"
            language={language === "cpp" ? "cpp" : language}
            theme={theme}
            value={code}
            onChange={(v) => setCode(v || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
              wordWrap: "on",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
      {/* Terminal */}
      <pre className="bg-base-300/80 text-base-content rounded-md h-40 overflow-auto whitespace-pre-wrap w-full border border-primary font-mono mt-4">
        <div className="flex justify-between items-center pb-2 bg-base-300 py-2 px-5 border-b">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-error"></div>
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </div>
          <p> {user!.name.split(" ")[0].toLocaleLowerCase()}@codegenie:~</p>
          <p className="text-sm">Terminal</p>
        </div>
        <div className="p-4">
          {user?.name && (
            <span className="text-sm text-accent">
              {user.name.split(" ")[0].toLocaleLowerCase()}@codegenie:~${" "}
              {output === null ? (
                <span className="terminalCursor bg-[--color-base-content]"></span>
              ) : (
                ""
              )}
            </span>
          )}
          <span
            className="terminal-output"
            dangerouslySetInnerHTML={{ __html: output! }}
          />
        </div>
      </pre>
    </>
  );
}
