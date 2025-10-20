import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";
import jwt from "jsonwebtoken";
import DataModel from "@/models/Data";
import LanguageUsage from "@/models/Language";

const execPromise = util.promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { language, code } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decodedData.id;
    if (!language || !code) {
      return NextResponse.json(
        { error: "Missing language or code" },
        { status: 400 }
      );
    }

    const output = await runCode(language, code, userId);
    return NextResponse.json({ output }, { status: 200 });
  } catch (error: any) {
    console.error("Error running code:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run code" },
      { status: 500 }
    );
  }
}

async function runCode(
  language: string,
  code: string,
  userId: string
): Promise<string> {
  const tempDir = path.join(process.cwd(), "temp_code");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const id = Date.now();
  let filePath = "";
  let cmd = "";

  try {
    switch (language.toLowerCase()) {
      case "python":
        filePath = path.join(tempDir, `code_${id}.py`);
        fs.writeFileSync(filePath, code);
        cmd = `py -3.12 "${filePath}"`;
        break;

      case "javascript":
        filePath = path.join(tempDir, `code_${id}.js`);
        fs.writeFileSync(filePath, code);
        cmd = `node "${filePath}"`;
        break;

      case "java":
        filePath = path.join(tempDir, `Main.java`);
        fs.writeFileSync(
          filePath,
          code.includes("class ")
            ? code
            : `public class Main { public static void main(String[] args) { ${code} } }`
        );
        cmd = `javac "${filePath}" && java -cp "${tempDir}" Main`;
        break;

      case "c":
        filePath = path.join(tempDir, `program_${id}.c`);
        fs.writeFileSync(filePath, code);
        cmd = `cl "${filePath}" -o "${tempDir}/program_${id}" && "${tempDir}/program_${id}"`;
        break;

      case "cpp":
        filePath = path.join(tempDir, `program_${id}.cpp`);
        fs.writeFileSync(filePath, code);
        cmd = `g++ "${filePath}" -o "${tempDir}/program_${id}" && "${tempDir}/program_${id}"`;
        break;

      default:
        throw new Error(`Unsupported language: ${language}`);
    }

    // find if we have existing data for today
    const { stdout, stderr } = await execPromise(cmd, { timeout: 8000 });
    if (stderr) return `⚠️ Errors:\n${stderr}`;
    const exisitingData = await DataModel.findOne({
      userId: userId,
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    if (exisitingData) {
      exisitingData.codeRun += 1;
      if (stderr) exisitingData.errorsDetected += 1;
      await exisitingData.save();
    } else {
      const newData = new DataModel({
        userId: userId,
        codeRun: 1,
        aiQueries: 0,
      });
      if (stderr) newData.errorsDetected = 1;
      await newData.save();
    }
    const languageData = await LanguageUsage.findOne({ userId: userId });
    if (!languageData) {
      const languageData = new LanguageUsage({ userId: userId });
      switch (language.toLowerCase()) {
        case "python":
          languageData.pythonUsage += 1;
          break;
        case "javascript":
          languageData.javaScriptUsage += 1;
          break;
        case "java":
          languageData.javaUsage += 1;
          break;
        case "c":
          languageData.cUsage += 1;
          break;
        case "cpp":
          languageData.cppUsage += 1;
          break;
      }
      await languageData.save();
    }
    switch (language.toLowerCase()) {
      case "python":
        languageData.pythonUsage += 1;
        break;
      case "javascript":
        languageData.javaScriptUsage += 1;
        break;
      case "java":
        languageData.javaUsage += 1;
        break;
      case "c":
        languageData.cUsage += 1;
        break;
      case "cpp":
        languageData.cppUsage += 1;
        break;
    }
    await languageData.save();
    return stdout || "✅ Executed successfully with no output.";
  } catch (err: any) {
    // increase error count
    const exisitingData = await DataModel.findOne({
      userId: userId,
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
    });
    if (exisitingData) {
      exisitingData.codeRun += 1;
      exisitingData.errorsDetected += 1;
      await exisitingData.save();
    } else {
      const newData = new DataModel({
        userId: userId,
        codeRun: 0,
        aiQueries: 0,
        errorsDetected: 1,
      });
      await newData.save();
    }
    return `❌ Runtime Error: ${err.message}`;
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  }
}
