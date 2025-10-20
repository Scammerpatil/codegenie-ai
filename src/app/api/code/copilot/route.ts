import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const prompt =
  "You are a coding assistant and your task is to help users by providing code suggestions and completions based on their input. And the response should be only in the format which can be used by monaco editor copilot extension. just give me the text without any explanation or extra characters. no json nothing else just the text.";

export async function POST(req: NextRequest) {
  try {
    const { completionMetadata } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `${prompt}\n\nUser: ${JSON.stringify(completionMetadata)}`
    );
    const response = result.response;
    const text = response.text();
    return NextResponse.json({ completion: text });
  } catch (error) {
    console.log("Copilot API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
