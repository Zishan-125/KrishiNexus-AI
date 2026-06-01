import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Standard initialization utilizing your .env.local file
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing required multi-modal image buffer parameters." }, { status: 400 });
    }

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: mimeType
      }
    };

    const systemPrompt = `
      You are an expert plant pathologist AI utilizing the frontier Gemini 3.5 engine.
      Analyze this crop leaf image for KrishiNexus AI.
      You MUST return your response strictly in valid JSON matching this schema:
      {
        "id": "DG_GEN_35",
        "cropType": "Crop name",
        "diseaseName": "English name (Scientific Name)",
        "diseaseBangla": "Disease name in Bangla",
        "confidence": 98.5,
        "symptomsBangla": "Detailed symptoms in Bangla",
        "treatmentRoadmapBangla": ["Step 1 Bangla", "Step 2 Bangla"],
        "organicAlternativesBangla": ["Organic option Bangla"]
      }
    `;

    // 🚀 Upgrading the core execution engine to Gemini 3.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', 
      contents: [imagePart, systemPrompt],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.15 // Slightly dialed down for tighter scientific structural alignment
      }
    });

    if (response.text) {
      const liveDiagnostics = JSON.parse(response.text);
      return NextResponse.json(liveDiagnostics);
    }

    return NextResponse.json({ error: "Empty stream response from Gemini 3.5 execution loop." }, { status: 500 });

  } catch (error: any) {
    console.error("Gemini 3.5 Flash Execution Failure:", error);
    return NextResponse.json({ error: "Internal Diagnostic Exception Raised", details: error.message }, { status: 500 });
  }
}