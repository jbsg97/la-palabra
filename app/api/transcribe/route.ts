import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string) ?? "es";

    if (!audioFile) {
      return NextResponse.json({ error: "Audio requerido" }, { status: 400 });
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Archivo demasiado grande" }, { status: 400 });
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3-turbo",
      language,
      response_format: "json",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (err) {
    console.error("Transcribe API error:", err);
    return NextResponse.json({ error: "Error al transcribir" }, { status: 500 });
  }
}
