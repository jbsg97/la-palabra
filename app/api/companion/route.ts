import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { buildSystemPrompt } from "@/lib/companion/prompt";

function getGroq() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });
}

interface CompanionRequest {
  userMessage: string;
  passageContext: {
    translation: string;
    bookName: string;
    chapter: number;
    text: string;
  };
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CompanionRequest;
    const { userMessage, passageContext, conversationHistory } = body;

    if (!userMessage?.trim()) {
      return new Response("Mensaje requerido", { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(passageContext);

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6), // max 3 turns
      { role: "user", content: userMessage },
    ];

    const groq = getGroq();
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 300,
      temperature: 0.7,
      stream: true,
    });

    // Stream as SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) {
              controller.enqueue(encoder.encode(`data: ${text}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Companion API error:", err);
    return new Response("Error interno del servidor", { status: 500 });
  }
}
