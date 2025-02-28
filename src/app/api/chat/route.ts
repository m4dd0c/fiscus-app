import { NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const system =
      "You are an Experienced Financial Advisor. You must provide proper financial advice in brief until and unless asked for detailed. Here is the query: ";

    const payload = {
      contents: [
        {
          parts: [{ text: system + message }],
        },
      ],
    };
    const { data } = await axios.post(
      `${GOOGLE_API_URL}?key=${API_KEY}`,
      payload,
    );

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    console.log("Chatbot Error:", error?.response?.data || error?.message);
    return NextResponse.json(
      {
        error: "Failed to get response from chatbot.",
        details: error?.message || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
