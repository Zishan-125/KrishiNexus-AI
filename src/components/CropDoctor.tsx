import React, { useState, useEffect } from "react";
import { 
  Sprout, 
  Camera, 
  Upload, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  SearchCheck
} from "lucide-react";
import { DiseaseDiagnostic } from "@/types";

export default function CropDoctor() {
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [diagnostic, setDiagnostic] = useState<DiseaseDiagnostic | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Check if Web Speech Synthesis is supported in client browser
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setTtsSupported(true);
    }
  }, []);

  // Preloaded crop disease mock specimens
  const specimens = [
    {
      id: "potato_late_blight",
      name: "Late Blight (Potato)",
      bangla: "আলুর নাবি ধসা রোগ",
      imgPlaceholder: "🥔",
      imgColor: "from-amber-800 to-yellow-600",
      diagnostic: {
        id: "DG_POT_001",
        cropType: "Potato",
        diseaseName: "Late Blight (Phytophthora infestans)",
        diseaseBangla: "আলুর নাবি ধসা রোগ (লেইট ব্লাইট)",
        confidence: 96.8,
        symptoms: "Dark, water-soaked lesions on leaves with white fuzzy mold growth underneath in humid conditions. Stems rot quickly.",
        symptomsBangla: "পাতায় ভেজা গোল দাগ দেখা যায় যা দ্রুত ছড়িয়ে পড়ে। ভেজা আবহাওয়ায় পাতার নিচে সাদা তুলার মতো ছাতা পড়ে এবং কাণ্ড পচে যায়।",
        cause: "High humidity (>90%) and cool temperatures (15-20°C) with persistent rainfall.",
        treatmentRoadmap: [
          "Spraying Mancozeb (ম্যানকোজেব) group fungicide (e.g. Indofil M-45) @ 2g per liter of water.",
          "Apply fungicide in late afternoon. Ensure coverage on leaf undersides.",
          "Stop irrigation immediately until dry weather returns.",
          "Remove and burn severely infected leaves to prevent spore transmission."
        ],
        treatmentRoadmapBangla: [
          "ম্যানকোজেব (Mancozeb) গ্রুপের ছত্রাকনাশক (যেমন: ইন্দofil M-45) প্রতি লিটার পানিতে ২ গ্রাম হারে মিশিয়ে স্প্রে করুন।",
          "স্প্রেটি বিকালের শেষ ভাগে করুন এবং পাতার নিচে ভালোভাবে স্প্রে নিশ্চিত করুন।",
          "পরবর্তী শুষ্ক আবহাওয়া না আসা পর্যন্ত সেচ দেওয়া সম্পূর্ণ বন্ধ রাখুন।",
          "বেশি আক্রান্ত গাছ তুলে পুড়িয়ে ফেলুন যাতে বাতাসে জীবাণু ছড়িয়ে না পড়ে।"
        ],
        organicAlternatives: [
          "Bordeaux Mixture (বোঁর্দো মিশ্রণ) spray (1% Copper Sulphate + 1% Lime mixture).",
          "Trichoderma harzianum (ট্রাইকোডার্মা) bio-fungicide soil treatment."
        ],
        organicAlternativesBangla: [
          "১% বোঁর্দো মিশ্রণ (তুঁতে ও চুন মিশ্রণ) তৈরি করে আক্রান্ত পাতায় স্প্রে করুন।",
          "জৈব ছত্রাকনাশক ট্রাইকোডার্মা মাটিতে প্রয়োগ করে মাটি শোধন করুন।"
        ]
      }
    },
    {
      id: "tomato_blight",
      name: "Early Blight (Tomato)",
      bangla: "টমেটোর আগাম ধসা রোগ",
      imgPlaceholder: "🍅",
      imgColor: "from-red-800 to-rose-600",
      diagnostic: {
        id: "DG_TOM_002",
        cropType: "Tomato",
        diseaseName: "Early Blight (Alternaria solani)",
        diseaseBangla: "টমেটোর আগাম ধসা রোগ (আর্লি ব্লাইট)",
        confidence: 94.2,
        symptoms: "Target-board circular dark spots on older leaves, surrounded by yellow halos. Fruit rots near the stem.",
        symptomsBangla: "নিচের বয়স্ক পাতায় চক্রাকার রিং আকৃতির কালচে বা বাদামি দাগ পড়ে, যার চারপাশে হলুদ রঙের আভা থাকে। ফল কাণ্ডের গোড়ায় পচে যায়।",
        cause: "Alternating wet and dry weather, combined with nitrogen-deficient soils.",
        treatmentRoadmap: [
          "Spray Iprodione (ইপ্রোডিয়ন) group fungicide (e.g. Rovral 50 WP) @ 2g per liter of water.",
          "Prune lower leaves up to 10 inches from ground to improve air circulation.",
          "Provide balanced potassium-rich fertilizers to boost leaf immunity.",
          "Apply mulching sheet to prevent soil-borne spores splashing onto leaves."
        ],
        treatmentRoadmapBangla: [
          "ইপ্রোডিয়ন (Iprodione) গ্রুপের ছত্রাকনাশক (যেমন: রভরাল ৫০ ডব্লিউপি) প্রতি লিটার পানিতে ২ গ্রাম মিশিয়ে স্প্রে করুন।",
          "মাটি থেকে ১০ ইঞ্চি উঁচুতে থাকা সব নিচের মরা ও দাগযুক্ত পাতা ছেঁটে দিন যাতে বাতাস চলাচল বাড়ে।",
          "গাছের রোগ প্রতিরোধ ক্ষমতা বাড়াতে সুষম পটাশ সার ব্যবহার করুন।",
          "গোড়ায় মালচিং পেপার ব্যবহার করুন যাতে স্পোর বৃষ্টির ছিটায় পাতায় না ছড়ায়।"
        ],
        organicAlternatives: [
          "Neem Oil (নিম তেল) spray @ 5ml/L mixed with soap water.",
          "Baking Soda spray (4g sodium bicarbonate + 5ml oil per liter)."
        ],
        organicAlternativesBangla: [
          "সাবান পানির সাথে নিম তেল (প্রতি লিটারে ৫ মিলি) মিশিয়ে প্রতি সপ্তাহে একবার স্প্রে করুন।",
          "বেকিং সোডা স্প্রে (১ লিটার পানিতে ৪ গ্রাম বেকিং সোডা এবং ৫ মিলি তেল মিশিয়ে)।"
        ]
      }
    },
    {
      id: "rice_blast",
      name: "Blast Disease (Rice)",
      bangla: "ধানের ব্লাস্ট রোগ",
      imgPlaceholder: "🌾",
      imgColor: "from-emerald-800 to-yellow-600",
      diagnostic: {
        id: "DG_RIC_003",
        cropType: "Rice",
        diseaseName: "Rice Blast (Pyricularia oryzae)",
        diseaseBangla: "ধানের ব্লাস্ট রোগ",
        confidence: 97.5,
        symptoms: "Spindle-shaped (eye-shaped) spots on leaves with gray centers and brown borders. Rotten necks block grain filling.",
        symptomsBangla: "পাতায় চোখের মতো চ্যাপ্টা বা মাকু আকৃতির দাগ হয় যার কেন্দ্র ধূসর ও চারপাশ বাদামি। ঘাড় পচা ব্লাস্ট ধানের শীষ সাদা ও চিটা করে ফেলে।",
        cause: "High nitrogen fertilizers, warm humid days (25-30°C) with dew-filled cool nights.",
        treatmentRoadmap: [
          "Apply Tricyclazole (ট্রাইসাইক্লাজল) group fungicide (e.g. Trooper 75 WP) @ 0.8g per liter.",
          "Ensure spray is focused on leaf joints and stem collars.",
          "Keep standing water level at 2 inches to reduce soil humidity stress.",
          "Avoid excessive Urea fertilizer application during grain formation."
        ],
        treatmentRoadmapBangla: [
          "ট্রাইসাইক্লাজল (Tricyclazole) গ্রুপের ছত্রাকনাশক (যেমন: ট্রুপার ৭৫ ডব্লিউপি) প্রতি লিটার পানিতে ০.৮ গ্রাম হারে স্প্রে করুন।",
          "স্প্রেটি ধানের শীষ ও পাতার গোড়ার জয়েন্টে ভালোভাবে দিন।",
          "জমিতে ২ ইঞ্চি পরিমাণ দাঁড়ানো পানি ধরে রাখুন যাতে মাটি শুকিয়ে আর্দ্রতার চাপ না তৈরি হয়।",
          "আক্রান্ত জমিতে ইউরিয়া সারের উপরিপ্রয়োগ সম্পূর্ণ বন্ধ রাখুন।"
        ],
        organicAlternatives: [
          "Foliar spray of garlic extract (১:১০ রেশিও পানিতে রসুনের রস)।",
          "Pseudomonas fluorescens bio-agent spray @ 5g/L."
        ],
        organicAlternativesBangla: [
          "রসুনের নির্যাস স্প্রে করুন (১ কেজি থেঁতলানো রসুন ১০ লিটার পানিতে ভিজিয়ে ছেঁকে স্প্রে)।",
          "সিউডোমোনাস ফ্লুরোসেন্স নামক ব্যাকটেরিয়াল বায়ো-এজেন্ট পানিতে মিশিয়ে পাতায় ছিটান।"
        ]
      }
    }
  ];

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    setDiagnostic(null);
    stopSpeaking();
  };

  const handleStartScan = () => {
    if (!selectedSample) return;
    setScanning(true);
    setDiagnostic(null);
    stopSpeaking();

    // Simulate multi-step laser scanning feedback
    setTimeout(() => {
      const activeSpecimen = specimens.find(s => s.id === selectedSample);
      if (activeSpecimen) {
        setDiagnostic(activeSpecimen.diagnostic);
      }
      setScanning(false);
    }, 3200);
  };

  const speakInstructions = () => {
    if (!ttsSupported || !diagnostic) return;

    if (speaking) {
      stopSpeaking();
      return;
    }

    // Compose vocal script in Bangla
    const intro = `রোগের নাম: ${diagnostic.diseaseBangla}। এটি সনাক্ত করার নিশ্চয়তা শতকরা ${Math.round(diagnostic.confidence)} ভাগ। `;
    const symptomScript = `লক্ষণ সমূহ: ${diagnostic.symptomsBangla}। `;
    const remedyIntro = `প্রতিকার সমূহ মনোযোগ দিয়ে শুনুন: `;
    const remedies = diagnostic.treatmentRoadmapBangla.join("। পরবর্তী ধাপ: ");
    const fullText = intro + symptomScript + remedyIntro + remedies;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = "bn-BD"; // Bengali Bangladesh locale
    utterance.rate = 0.9;      // Slightly slower for farmer understanding

    utterance.onend = () => {
      setSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
    };

    setSpeechUtterance(utterance);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  };

  // Ensure voice stops on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const activeSpecimen = specimens.find(s => s.id === selectedSample);

  return (
    <div className="glass-card p-6 bg-slateforest-800/60 flex flex-col h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-agri-500/20 border border-agri-500/30 rounded-xl">
            <SearchCheck className="w-5 h-5 text-agri-400" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold text-white tracking-wide">
              AI Crop Doctor (শস্য চিকিৎসক)
            </h2>
            <p className="text-xs text-slateforest-400">
              Multimodal disease detection and localized crop advisory in Bangla.
            </p>
          </div>
        </div>
        
        {diagnostic && (
          <button 
            onClick={() => {
              setSelectedSample(null);
              setDiagnostic(null);
              stopSpeaking();
            }}
            className="text-xs flex items-center gap-1 text-slateforest-400 hover:text-white cursor-pointer bg-slateforest-950/50 px-2.5 py-1.5 rounded-lg border border-slateforest-700/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Scanner
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Visual Feed & Scan Interface */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider block">
            Step 1: Upload leaf or Select Specimen
          </span>

          {/* Simulated Camera Window */}
          <div className="relative aspect-video rounded-xl bg-slateforest-950/80 border border-slateforest-700/80 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
            
            {/* Background grid dots */}
            <div className="absolute inset-0 bg-dot-grid opacity-30 z-0"></div>

            {/* Simulated Live View */}
            {activeSpecimen ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slateforest-900 to-slateforest-950 z-0">
                <div className={`w-28 h-28 rounded-full bg-gradient-to-br ${activeSpecimen.imgColor} flex items-center justify-center text-5xl shadow-xl shadow-black/30 border border-white/10 group-hover:scale-105 transition-transform duration-300 relative`}>
                  {activeSpecimen.imgPlaceholder}
                  
                  {/* Bounding box simulation when diagnostic ready */}
                  {diagnostic && (
                    <div className="absolute inset-0 border-2 border-dashed border-red-500 rounded-full animate-pulse">
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Lesion: {diagnostic.confidence}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center mt-3 z-10">
                  <span className="text-xs font-semibold text-white block">
                    {activeSpecimen.name}
                  </span>
                  <span className="text-[10px] text-slateforest-400">
                    {activeSpecimen.bangla}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center p-6 z-10">
                <div className="p-4 bg-slateforest-900/60 rounded-full border border-slateforest-700">
                  <Camera className="w-8 h-8 text-slateforest-400 group-hover:text-agri-400 transition-colors" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">
                    No leaf image captured
                  </span>
                  <span className="text-xs text-slateforest-500 max-w-xs block mt-1">
                    Select a high-resolution preloaded leaf sample below to run the AI simulation.
                  </span>
                </div>
              </div>
            )}

            {/* Laser scanning beam overlay */}
            {scanning && (
              <>
                <div className="laser-scanner animate-laser-scan"></div>
                <div className="absolute inset-0 border-2 border-agri-500/50 bg-agri-500/5 z-20 flex flex-col items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-slateforest-950/80 px-4 py-2 rounded-xl border border-agri-500/30 flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-agri-500 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-widest animate-pulse">
                      AI Analyzing Symptoms...
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Specimen Buttons */}
          {!diagnostic && !scanning && (
            <div className="grid grid-cols-3 gap-2">
              {specimens.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSample(s.id)}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                    selectedSample === s.id
                      ? "border-agri-500 bg-agri-500/5 text-white"
                      : "border-slateforest-700 bg-slateforest-900/40 text-slateforest-400 hover:border-slateforest-500"
                  }`}
                >
                  <span className="text-2xl block mb-1">{s.imgPlaceholder}</span>
                  <span className="text-[10px] font-bold block truncate">{s.name.split(" ")[0]} Leaf</span>
                  <span className="text-[9px] text-slateforest-500 block truncate">{s.bangla}</span>
                </button>
              ))}
            </div>
          )}

          {/* Capture Trigger */}
          {!diagnostic && !scanning && (
            <button
              onClick={handleStartScan}
              disabled={!selectedSample}
              className={`glass-button-primary w-full text-xs cursor-pointer ${
                !selectedSample ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Scan & Diagnose (রোগ নির্ণয় করুন)
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Diagnostic Results Sheet */}
        <div className="flex flex-col">
          {scanning ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slateforest-900/20 border border-dashed border-slateforest-700 rounded-xl">
              <div className="w-10 h-10 border-2 border-agri-500/20 border-t-agri-500 rounded-full animate-spin mb-4"></div>
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase mb-1">
                Running Neural Diagnostics
              </h3>
              <p className="text-xs text-slateforest-400 leading-relaxed max-w-xs">
                Scanning leaf chlorophyll content, discoloration gradients, and spotting formations to identify active pathogens...
              </p>
            </div>
          ) : diagnostic ? (
            <div className="flex flex-col gap-4 animate-fade-in-up bg-slateforest-900/40 border border-slateforest-700/50 rounded-xl p-5 h-full">
              
              {/* Header metrics */}
              <div className="flex justify-between items-start border-b border-slateforest-800 pb-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                      Infected: {diagnostic.cropType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slateforest-950 text-slateforest-400 border border-slateforest-700 rounded font-mono">
                      {diagnostic.id}
                    </span>
                  </div>
                  <h3 className="text-base font-display font-semibold text-white tracking-wide">
                    {diagnostic.diseaseName}
                  </h3>
                  <h4 className="text-sm font-semibold text-agri-400 font-sans mt-0.5">
                    {diagnostic.diseaseBangla}
                  </h4>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slateforest-400 uppercase tracking-widest block font-bold mb-0.5">
                    Confidence
                  </span>
                  <span className="text-lg font-mono font-black text-red-400">
                    {diagnostic.confidence}%
                  </span>
                </div>
              </div>

              {/* LOCALIZED AUDIO READER BUTTON */}
              {ttsSupported && (
                <div className="bg-gradient-to-r from-agri-600/15 to-emerald-600/0 border border-agri-500/20 rounded-xl p-3.5 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border bg-slateforest-950/80 transition-all ${
                      speaking ? "border-agri-500 text-agri-400 animate-pulse" : "border-slateforest-700 text-slateforest-400"
                    }`}>
                      {speaking ? <Volume2 className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">
                        Bangla Voice Reader (বাংলা নির্দেশনা শুনুন)
                      </h4>
                      <p className="text-[10px] text-slateforest-400 mt-0.5">
                        {speaking ? "Playing audio synthesis... Tap to stop" : "Listen to diagnosis & treatment steps"}
                      </p>
                    </div>
                  </div>
                  
                  {speaking && (
                    <div className="flex items-center gap-1 shrink-0 h-4 mr-4">
                      <span className="voice-wave"></span>
                      <span className="voice-wave"></span>
                      <span className="voice-wave"></span>
                      <span className="voice-wave"></span>
                      <span className="voice-wave"></span>
                    </div>
                  )}

                  <button
                    onClick={speakInstructions}
                    className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200 shrink-0 ${
                      speaking 
                        ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
                        : "bg-agri-500 text-white shadow shadow-agri-500/20 hover:bg-agri-400"
                    }`}
                  >
                    {speaking ? "Stop Audio" : "Play Voice"}
                  </button>
                </div>
              )}

              {/* Symptoms */}
              <div className="text-xs">
                <span className="font-bold text-white block mb-1">Symptoms (লক্ষণ):</span>
                <p className="text-slateforest-300 bg-slateforest-950/40 p-2.5 rounded-lg border border-slateforest-800 leading-relaxed">
                  {diagnostic.symptomsBangla}
                </p>
              </div>

              {/* Treatment Roadmap Tab */}
              <div className="text-xs flex flex-col gap-2.5">
                <span className="font-bold text-white block">Treatment Roadmap (জরুরী সমাধান):</span>
                <ul className="flex flex-col gap-2">
                  {diagnostic.treatmentRoadmapBangla.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-slateforest-300">
                      <span className="w-5 h-5 rounded-full bg-agri-500/15 border border-agri-500/20 text-agri-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic alternatives */}
              <div className="text-[11px] border-t border-slateforest-800 pt-4 mt-auto">
                <span className="font-bold text-market-gold block mb-1">Organic Alternatives (জৈব উপায়):</span>
                <div className="flex flex-col gap-1 text-slateforest-400">
                  {diagnostic.organicAlternativesBangla.map((alt, idx) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-market-gold shrink-0"></span>
                      {alt}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slateforest-950/30 border border-slateforest-700/40 rounded-xl text-slateforest-500">
              <Sprout className="w-12 h-12 text-slateforest-600 mb-3 animate-pulse" />
              <h3 className="text-sm font-semibold text-white tracking-wide mb-1">
                Diagnostic Output Ready
              </h3>
              <p className="text-xs text-slateforest-500 leading-relaxed max-w-xs">
                Select a crop specimen on the left and click "Scan & Diagnose" to initiate neural symptom mapping. Detailed recommendations and voice synthesis will generate here.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
