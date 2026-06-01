import React, { useState, useRef } from "react";
import { CropListing, CropCategory, EscrowOrder } from "@/types";
import { 
  Sprout, 
  PlusCircle, 
  HelpCircle, 
  Wallet, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  Calendar,
  DollarSign,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Activity
} from "lucide-react";

interface FarmerPortalProps {
  listings: CropListing[];
  onAddListing: (listing: Omit<CropListing, "id" | "farmerId" | "farmerName" | "farmerPhone" | "status">) => void;
  orders: EscrowOrder[];
  walletBalance: number;
  pendingEscrow: number;
}

export default function FarmerPortal({ 
  listings, 
  onAddListing, 
  orders, 
  walletBalance, 
  pendingEscrow 
}: FarmerPortalProps) {
  // Existing Listing Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropType, setCropType] = useState<CropCategory>("rice");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [pricePerKg, setPricePerKg] = useState<number>(0);
  const [location, setLocation] = useState("Feni");
  const [harvestDate, setHarvestDate] = useState("");
  const [description, setDescription] = useState("");
  const [aiPriceSuggested, setAiPriceSuggested] = useState(0);

  // 🚀 NEW: AI Crop Doctor (শস্য চিকিৎসক) Local Feature States
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [cropDiagnosis, setCropDiagnosis] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested direct-to-market prices based on district pricing feeds
  const recommendedAIPrices: Record<CropCategory, number> = {
    rice: 65,
    potato: 42,
    tomato: 68,
    onion: 125,
    chili: 145,
    lentil: 135
  };

  const handleSuggestPrice = () => {
    const suggestion = recommendedAIPrices[cropType];
    setAiPriceSuggested(suggestion);
    setPricePerKg(suggestion); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!variety || quantity <= 0 || pricePerKg <= 0 || !harvestDate) return;

    onAddListing({
      cropType,
      variety,
      quantity,
      pricePerKg,
      totalAmount: quantity * pricePerKg,
      harvestDate,
      location,
      description,
      recommendedPrice: recommendedAIPrices[cropType]
    });

    // Reset Form
    setVariety("");
    setQuantity(0);
    setPricePerKg(0);
    setHarvestDate("");
    setDescription("");
    setAiPriceSuggested(0);
    setShowAddForm(false);
  };

  // 🚀 NEW: AI Crop Doctor Binary Stream Reader
  const handleCropImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setAiError("চিত্রটি ৫ মেগাবাইটের (5MB) চেয়ে ছোট হতে হবে।");
      return;
    }

    setImageMimeType(file.type);
    setAiError(null);
    setCropDiagnosis(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setCropImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 🚀 NEW: API dispatcher targeting your Next.js route engine
  const handleAnalyzeCropDisease = async () => {
    if (!cropImage || !imageMimeType) {
      setAiError("অনুগ্রহ করে প্রথমে ফসলের একটি স্পষ্ট ছবি আপলোড করুন।");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setCropDiagnosis(null);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: cropImage,
          mimeType: imageMimeType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "রোগ সনাক্তকরণে ব্যর্থতা ঘটেছে।");
      }

      setCropDiagnosis(data);
    } catch (err: any) {
      console.error("Diagnostic error:", err);
      setAiError(err.message || "সার্ভারে সংযোগ সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setAiLoading(false);
    }
  };

  const farmerListings = listings;
  const farmerOrders = orders;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wallet Balance */}
        <div className="glass-card p-5 bg-gradient-to-br from-agri-500/10 to-slateforest-800/60 border-agri-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider">
              Available Wallet Balance
            </span>
            <Wallet className="w-5 h-5 text-agri-400" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-wide font-mono">
            {walletBalance.toLocaleString()} <span className="text-lg font-sans font-normal text-slateforest-400">BDT</span>
          </h2>
          <p className="text-[10px] text-slateforest-400 mt-1">
            Linked to bKash / Nagad wallet (Auto-released on verified deliveries).
          </p>
        </div>

        {/* Escrow Funds */}
        <div className="glass-card p-5 bg-gradient-to-br from-market-gold/10 to-slateforest-800/60 border-market-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider">
              Escrow Locked Funds
            </span>
            <DollarSign className="w-5 h-5 text-market-gold" />
          </div>
          <h2 className="text-3xl font-display font-extrabold text-white tracking-wide font-mono">
            {pendingEscrow.toLocaleString()} <span className="text-lg font-sans font-normal text-slateforest-400">BDT</span>
          </h2>
          <p className="text-[10px] text-slateforest-400 mt-1">
            Funds held securely via SSLCommerz sandbox pending transit handshake.
          </p>
        </div>

        {/* Telemetry info */}
        <div className="glass-card p-5 bg-slateforest-800/60 flex flex-col justify-center">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slateforest-400">Total Active Listings:</span>
            <span className="font-mono font-bold text-white">{farmerListings.length}</span>
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slateforest-400">Active Escrow Orders:</span>
            <span className="font-mono font-bold text-market-gold">
              {farmerOrders.filter(o => o.paymentStatus === "escrowed").length}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slateforest-400">Successfully Completed:</span>
            <span className="font-mono font-bold text-agri-400">
              {farmerOrders.filter(o => o.paymentStatus === "released").length}
            </span>
          </div>
        </div>
      </div>

      {/* 🚀 NEW WORKSPACE ROW: Splitting Harvest Entry and the Multimodal AI Doctor Portal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COMPONENT (Span 2): Original Harvest Workflows */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* HARVEST LISTINGS HUB HEADER */}
          <div className="glass-card p-5 flex items-center justify-between bg-slateforest-800/40">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">
                Your Upcoming Harvest Listings
              </h3>
              <p className="text-xs text-slateforest-400">
                Post upcoming crop stocks to attract direct restaurant and retail buyers.
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="glass-button-primary text-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {showAddForm ? "Close Form" : "List New Harvest"}
            </button>
          </div>

          {/* ADD HARVEST FORM */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="glass-card p-6 bg-slateforest-900 border-agri-500/30 flex flex-col gap-4 animate-fade-in-up">
              <h3 className="text-sm font-bold text-white tracking-wide border-b border-slateforest-800 pb-3 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-agri-400 animate-bounce" />
                Harvest Listing Form (নতুন ফসল লিস্টিং)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Crop Category (ফসলের ধরন)</label>
                  <select
                    value={cropType}
                    onChange={(e) => {
                      setCropType(e.target.value as CropCategory);
                      setAiPriceSuggested(0);
                    }}
                    className="glass-input h-12 text-sm appearance-none"
                  >
                    <option value="rice">Aman Rice (চাল)</option>
                    <option value="potato">Diamant Potato (আলু)</option>
                    <option value="tomato">Hybrid Tomato (টমেটো)</option>
                    <option value="onion">Local Onion (পেঁয়াজ)</option>
                    <option value="chili">Green Chili (কাঁচামরিচ)</option>
                    <option value="lentil">Lentil (ডাল)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Variety / Brand (জাত বা কোয়ালিটি)</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Miniket (মিনিকেট) / BR-28"
                    className="glass-input text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Estimated Quantity (মোট পরিমাণ - কেজি)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity || ""}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="e.g. 500"
                    className="glass-input font-mono text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Regional Farm Origin (উৎপত্তিস্থল)</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input h-12 text-sm"
                  >
                    <option value="Feni Sadar, Feni">Feni Sadar, Feni</option>
                    <option value="Daganbhuiyan, Feni">Daganbhuiyan, Feni</option>
                    <option value="Chhagalnaiya, Feni">Chhagalnaiya, Feni</option>
                    <option value="Chauddagram, Comilla">Chauddagram, Comilla</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Estimated Harvest Date (ফসল তোলার তারিখ)</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="glass-input text-sm font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slateforest-400 flex justify-between items-center">
                    <span>Desired Listing Price (মূল্য প্রতি কেজি)</span>
                    <button
                      type="button"
                      onClick={handleSuggestPrice}
                      className="text-[10px] font-bold text-agri-400 hover:text-agri-300 flex items-center gap-1 cursor-pointer bg-agri-500/10 px-2 py-0.5 rounded border border-agri-500/20"
                    >
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      Get AI Price
                    </button>
                  </label>
                  
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      required
                      value={pricePerKg || ""}
                      onChange={(e) => setPricePerKg(Number(e.target.value))}
                      placeholder="Pricing per KG in BDT"
                      className="glass-input font-mono text-sm pr-16"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slateforest-500 font-bold">
                      BDT/Kg
                    </span>
                  </div>

                  {aiPriceSuggested > 0 && (
                    <span className="text-[10px] text-agri-400 mt-1 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI recommended direct-to-market rate loaded: {aiPriceSuggested} BDT/Kg
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slateforest-400">Stock Description (ফসল বিবরণ)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your stock crop quality details..."
                  className="glass-input text-sm resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-slateforest-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="glass-button-secondary text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glass-button-primary text-xs cursor-pointer"
                >
                  Confirm & Publish Listing
                </button>
              </div>
            </form>
          )}

          {/* ACTIVE HARVEST LISTINGS GRID */}
          <div className="flex flex-col gap-3">
            {farmerListings.length === 0 ? (
              <div className="glass-card p-8 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
                <FileText className="w-10 h-10 text-slateforest-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">No Active Harvests Listed</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmerListings.map((listing) => (
                  <div key={listing.id} className="glass-card p-5 flex flex-col gap-4 bg-slateforest-850/40 relative overflow-hidden">
                    <div className="absolute right-4 top-4 text-3xl opacity-35">
                      {listing.cropType === "rice" ? "🌾" : listing.cropType === "potato" ? "🥔" : listing.cropType === "tomato" ? "🍅" : listing.cropType === "onion" ? "🧅" : listing.cropType === "chili" ? "🌶️" : "🫘"}
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          listing.status === "available" ? "bg-agri-500/10 border-agri-500/20 text-agri-400" : "bg-market-gold/10 border-market-gold/20 text-market-gold"
                        }`}>
                          {listing.status === "available" ? "Direct Market Available" : "Funds Escrowed"}
                        </span>
                        <span className="font-mono text-[9px] text-slateforest-500">{listing.id}</span>
                      </div>
                      <h4 className="text-sm font-display font-semibold text-white tracking-wide capitalize">
                        {listing.cropType} ({listing.variety})
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slateforest-400 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-agri-400" />
                        <span>Harvest: {listing.harvestDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-slateforest-950/40 p-3 rounded-xl border border-slateforest-800 text-xs font-mono text-center">
                      <div>
                        <span className="text-[9px] text-slateforest-500 block uppercase font-sans">Stock</span>
                        <span className="font-bold text-white">{listing.quantity} kg</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slateforest-500 block uppercase font-sans">Rate</span>
                        <span className="font-bold text-agri-400">{listing.pricePerKg} BDT</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slateforest-500 block uppercase font-sans">Value</span>
                        <span className="font-bold text-white">{listing.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (Span 1): Hosts AI Crop Doctor and Orders Loop */}
        <div className="flex flex-col gap-6">
          
          {/* 🚀 NEW: AI CROP DOCTOR (শস্য চিকিৎসক) INTERACTIVE PORTAL */}
          <div className="glass-card p-5 bg-gradient-to-b from-slateforest-900 via-slateforest-900 to-slateforest-950/90 border border-agri-500/30 shadow-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                AI Crop Doctor (শস্য চিকিৎসক)
              </h3>
              <p className="text-xs text-slateforest-400 mt-1 leading-relaxed">
                ফসলের আক্রান্ত পাতার স্পষ্ট ছবি তুলুন অথবা আপলোড করুন। আমাদের কৃত্রিম বুদ্ধিমত্তা চালিত ইঞ্জিন সাথে সাথে রোগ ও তার সমাধান জানিয়ে দেবে।
              </p>
            </div>

            {/* Hidden Input Core File Tracker */}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" // Forces physical mobile cameras to open instead of system file trees
              ref={fileInputRef}
              onChange={handleCropImageUpload}
              className="hidden"
            />

            {/* Camera / Dropzone Area wrapper */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slateforest-700 hover:border-emerald-500/60 rounded-xl p-4 text-center transition duration-200 bg-slateforest-950/50 cursor-pointer overflow-hidden flex flex-col justify-center items-center gap-2 min-h-[140px]"
            >
              {cropImage ? (
                <div className="relative w-full h-full max-h-[180px] rounded-lg overflow-hidden group">
                  <img src={cropImage} alt="Crop Leaf Sample" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-150 text-[11px] text-white font-medium">
                    Change Image (ছবি পরিবর্তন করুন)
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-slateforest-500" />
                  <span className="text-xs font-semibold text-slateforest-300 block">পাতার ছবি তুলুন / আপলোড করুন</span>
                  <span className="text-[9px] text-slateforest-500 block">Supports PNG, JPG up to 5MB</span>
                </>
              )}
            </div>

            {aiError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 text-[11px] text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {/* Trigger Submission State Controls */}
            {cropImage && !cropDiagnosis && (
              <button
                type="button"
                onClick={handleAnalyzeCropDisease}
                disabled={aiLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-agri-500 hover:from-emerald-600 hover:to-agri-600 text-slateforest-950 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-40"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> রোগ বিশ্লেষণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> রোগ নির্ণয় করুন (Run AI Analysis)
                  </>
                )}
              </button>
            )}

            {/* AI DIAGNOSIS REPORT SHEET IN BANGLA */}
            {cropDiagnosis && (
              <div className="p-4 bg-slateforest-950 rounded-xl border border-emerald-500/20 space-y-3 animate-fade-in text-xs leading-relaxed">
                <div className="flex items-center justify-between border-b border-slateforest-800 pb-2">
                  <span className="font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                    {cropDiagnosis.cropType || "শনাক্তকৃত ফসল"}
                  </span>
                  <span className="text-slateforest-400 font-medium flex items-center gap-1 text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {cropDiagnosis.confidence || "95"}% Accuracy
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm">{cropDiagnosis.diseaseName}</h4>
                  <h5 className="font-bold text-emerald-400 mt-0.5 text-xs">{cropDiagnosis.diseaseBangla}</h5>
                </div>

                <div className="space-y-2.5 text-slateforest-300">
                  <p>
                    <strong className="text-slateforest-400 block text-[11px] mb-0.5">আক্রান্ত পাতার লক্ষণ:</strong>
                    {cropDiagnosis.symptomsBangla}
                  </p>
                  
                  <div>
                    <strong className="text-slateforest-400 block text-[11px] mb-1">প্রতিকার ও চিকিৎসা রোডম্যাপ:</strong>
                    <ul className="list-disc list-inside space-y-1 pl-0.5 text-slateforest-200">
                      {cropDiagnosis.treatmentRoadmapBangla?.map((step: string, index: number) => (
                        <li key={index} className="text-slateforest-300">{step}</li>
                      ))}
                    </ul>
                  </div>

                  {cropDiagnosis.organicAlternativesBangla && (
                    <div className="bg-emerald-950/20 border border-emerald-900/40 p-2 rounded-lg text-emerald-300">
                      <strong className="block text-emerald-400 text-[10px] uppercase font-bold mb-0.5">জৈব বা প্রাকৃতিক সমাধান:</strong>
                      {cropDiagnosis.organicAlternativesBangla}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ESCROW ORDERS LOGGER */}
          <div className="flex flex-col gap-3.5">
            <div className="glass-card p-4 bg-slateforest-800/20 border-b border-slateforest-700/40">
              <h3 className="text-xs font-semibold text-white tracking-wide">Live Escrow Orders Log</h3>
            </div>

            {farmerOrders.length === 0 ? (
              <div className="glass-card p-6 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
                <p className="text-xs">No active escrow purchases logged yet.</p>
              </div>
            ) : (
              farmerOrders.map((order) => (
                <div key={order.id} className="glass-card p-5 bg-slateforest-900 border-slateforest-700 flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-slateforest-800 pb-3">
                    <div>
                      <span className="font-mono text-[9px] text-slateforest-500 block">{order.id}</span>
                      <h4 className="text-xs font-semibold text-white capitalize">
                        {order.cropType} Sale ({order.quantity} kg)
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-agri-400 text-sm">{order.totalAmount.toLocaleString()} BDT</span>
                    </div>
                  </div>
                  {/* Milestones map */}
                  <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-agri-500/20 text-agri-400 flex items-center justify-center shrink-0 text-[10px]">✓</div>
                      <span className="text-slateforest-300">Payment Escrowed via {order.paymentGateway}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}