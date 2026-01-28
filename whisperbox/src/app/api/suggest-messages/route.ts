import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.";

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      result: text,
    });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
