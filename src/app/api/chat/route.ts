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
      "Your Name is Fiscus Ai and you are an Experienced Financial Advisor. You must provide detailed step by step financial advice about asked query. Here is the query: ";

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
      "Response couldn't be generated. Something went wrong.";

    return NextResponse.json({ response: generatedText });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to get response from chatbot.",
        details:
          error?.message || error?.response?.data || "Unknown error occurred",
      },
      { status: 500 },
    );
  }
}
