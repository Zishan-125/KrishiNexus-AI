import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { specimenId } = body;

    // Disease database mock
    const database: Record<string, any> = {
      potato_late_blight: {
        id: "DG_POT_001",
        cropType: "Potato",
        diseaseName: "Late Blight (Phytophthora infestans)",
        diseaseBangla: "আলুর নাবি ধসা রোগ (লেইট ব্লাইট)",
        confidence: 96.8,
        symptoms: "Dark, water-soaked lesions on leaves with white fuzzy mold growth underneath.",
        symptomsBangla: "পাতায় ভেজা গোল দাগ দেখা যায় যা দ্রুত ছড়িয়ে পড়ে। পাতার নিচে সাদা তুলার মতো ছাতা পড়ে।",
        cause: "High humidity (>90%) and cool temperatures (15-20°C).",
        treatmentRoadmap: [
          "Spraying Mancozeb group fungicide @ 2g per liter.",
          "Apply fungicide in late afternoon. Stop irrigation."
        ],
        treatmentRoadmapBangla: [
          "ম্যানকোজেব (Mancozeb) গ্রুপের ছত্রাকনাশক প্রতি লিটার পানিতে ২ গ্রাম হারে মিশিয়ে স্প্রে করুন।",
          "স্প্রেটি বিকালের শেষ ভাগে করুন এবং সেচ দেওয়া বন্ধ রাখুন।"
        ],
        organicAlternatives: ["Bordeaux Mixture (1% Copper Sulphate + 1% Lime mixture)"],
        organicAlternativesBangla: ["১% বোঁর্দো মিশ্রণ (তুঁতে ও চুন মিশ্রণ) তৈরি করে স্প্রে করুন।"]
      },
      tomato_blight: {
        id: "DG_TOM_002",
        cropType: "Tomato",
        diseaseName: "Early Blight (Alternaria solani)",
        diseaseBangla: "টমেটোর আগাম ধসা রোগ (আর্লি ব্লাইট)",
        confidence: 94.2,
        symptoms: "Target-board circular dark spots on older leaves, surrounded by yellow halos.",
        symptomsBangla: "বয়স্ক পাতায় চক্রাকার রিং আকৃতির কালচে বা বাদামি দাগ পড়ে, চারপাশে হলুদ আভা থাকে।",
        cause: "Alternating wet and dry weather, combined with nitrogen-deficient soils.",
        treatmentRoadmap: [
          "Spray Iprodione group fungicide @ 2g per liter.",
          "Prune lower leaves up to 10 inches from ground."
        ],
        treatmentRoadmapBangla: [
          "ইপ্রোডিয়ন (Iprodione) গ্রুপের ছত্রাকনাশক প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে স্প্রে করুন।",
          "মাটি থেকে ১০ ইঞ্চি উঁচুতে থাকা সব নিচের মরা পাতা ছেঁটে দিন।"
        ],
        organicAlternatives: ["Neem Oil spray @ 5ml/L mixed with soap water"],
        organicAlternativesBangla: ["সাবান পানির সাথে নিম তেল মিশিয়ে স্প্রে করুন।"]
      },
      rice_blast: {
        id: "DG_RIC_003",
        cropType: "Rice",
        diseaseName: "Rice Blast (Pyricularia oryzae)",
        diseaseBangla: "ধানের ব্লাস্ট রোগ",
        confidence: 97.5,
        symptoms: "Spindle-shaped spots on leaves with gray centers and brown borders.",
        symptomsBangla: "পাতায় চোখের মতো চ্যাপ্টা বা মাকু আকৃতির দাগ হয় যার কেন্দ্র ধূসর ও চারপাশ বাদামি।",
        cause: "High nitrogen fertilizers, warm humid days with dew-filled cool nights.",
        treatmentRoadmap: [
          "Apply Tricyclazole group fungicide @ 0.8g per liter.",
          "Keep standing water level at 2 inches."
        ],
        treatmentRoadmapBangla: [
          "ট্রাইসাইক্লাজল (Tricyclazole) গ্রুপের ছত্রাকনাশক প্রতি লিটার পানিতে ০.৮ গ্রাম হারে স্প্রে করুন।",
          "জমিতে ২ ইঞ্চি পরিমাণ দাঁড়ানো পানি ধরে রাখুন।"
        ],
        organicAlternatives: ["Foliar spray of garlic extract"],
        organicAlternativesBangla: ["রসুনের রস স্প্রে করুন (১:১০ রেশিও পানিতে)।"]
      }
    };

    const result = database[specimenId];

    if (!result) {
      return NextResponse.json({ error: "Specimen not identified" }, { status: 404 });
    }

    // Artificially delay to simulate network latency & ML model runtime
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
