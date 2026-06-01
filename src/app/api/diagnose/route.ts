import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// FIX: Changed 'process.env.local.GEMINI_API_KEY' to 'process.env.GEMINI_API_KEY'
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json(
        { error: "Missing required multi-modal image parameters." }, 
        { status: 400 }
      );
    }

    const imagePart = {
      inlineData: {
        data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
        mimeType: mimeType
      }
    };

    const systemPrompt = `
      You are an expert plant pathologist AI utilizing the Gemini engine.
      Analyze this crop image for KrishiNexus AI.
      You MUST return your response strictly in valid JSON matching this schema format exactly. 
      Do not wrap your output in markdown code blocks like \`\`\`json. Return pure raw JSON string text only.

      {
        "id": "DG_GEN_35",
        "cropType": "Crop name",
        "diseaseName": "English name (Scientific Name)",
        "diseaseBangla": "Disease name in Bangla",
        "confidence": 95.5,
        "symptomsBangla": "Detailed symptoms in Bangla",
        "treatmentRoadmapBangla": ["Step 1 Bangla", "Step 2 Bangla"],
        "organicAlternativesBangla": "Organic option text in Bangla"
      }
    `;

    // 📡 Live-only network call with NO fallback block
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: [imagePart, systemPrompt],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.15
      }
    });

    if (response && response.text) {
      const liveDiagnostics = JSON.parse(response.text.trim());
      return NextResponse.json(liveDiagnostics);
    }
    
    throw new Error("Empty text block returned from the model API.");

  } catch (error: any) {
    console.error("Critical Exception Raised:", error);
    return NextResponse.json(
      { error: "Live API Call Failed", details: error.message }, 
      { status: 500 }
    );
  }
}