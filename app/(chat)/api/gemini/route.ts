// app/api/gemini/route.ts
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";

const gemini = google("gemini-1.5-flash"); // Initialize Gemini AI

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: "No input provided" }, { status: 400 });
  }

  try {
    // Proper structure for Gemini API
    const result = await gemini.doGenerate({
      inputFormat: "messages", // Gemini expects an array of messages
      mode: { type: "regular" }, // Standard AI processing mode
      prompt: [
        { role: "user", content: message }, // Proper message format
      ],
    });

    return NextResponse.json({ reply: result.text ?? "No response generated" });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "AI Error" }, { status: 500 });
  }
}
