import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const prompt =
  "You are a CodeGenie AI Assistant. Your task is to help users by responding helpfully to their queries about coding. Always respond in a concise and clear manner. You can use code snippets where necessary and ensure that your responses are easy to understand. Sometimes, users may ask for explanations, code examples, or debugging help. Always aim to provide the most accurate and helpful information possible and you can use markdown formatting for the responses.";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(`${prompt}\n\nUser: ${input}`);
    const response = result.response;
    const text = response.text();
    return NextResponse.json({ output: text });
  } catch (error) {
    console.log("Gemini API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
