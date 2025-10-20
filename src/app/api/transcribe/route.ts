import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { promisify } from "util";
import whisper from "whisper-node";
const TEMP_DIR = path.join(process.cwd(), "tmp");

const exec = promisify(execSync);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    // Check if file was uploaded
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Clean up any existing temp files
    if (fs.existsSync(TEMP_DIR)) {
      fs.readdirSync(TEMP_DIR).forEach((file) => {
        fs.unlinkSync(path.join(TEMP_DIR, file));
      });
    }

    // Create temporary directory for this request
    fs.mkdirSync(TEMP_DIR, { recursive: true });

    // Generate a temp path for the uploaded file
    const tempFilePath = path.join(
      TEMP_DIR,
      `${Date.now()}-${Math.random()}.webm`
    );

    // Convert the uploaded Blob into a Buffer and save it to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempFilePath, buffer);

    // Convert webm file to wav format using ffmpeg
    const wavFilePath = tempFilePath.replace(".webm", ".wav");
    await exec(
      `ffmpeg -i ${tempFilePath} -ar 16000 -ac 1 -c:a pcm_s16le ${wavFilePath}`
    );

    // Transcribe the wav file using Whisper
    const transcription = await whisper.transcribe(wavFilePath);

    // Clean up temp files after transcription
    fs.unlinkSync(tempFilePath); // Delete the original webm file
    fs.unlinkSync(wavFilePath); // Delete the converted wav file

    return NextResponse.json({ text: transcription.text }, { status: 200 });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
