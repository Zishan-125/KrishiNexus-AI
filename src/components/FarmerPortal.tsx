import React, { useState } from "react";
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
  DollarSign
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
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropType, setCropType] = useState<CropCategory>("rice");
  const [variety, setVariety] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [pricePerKg, setPricePerKg] = useState<number>(0);
  const [location, setLocation] = useState("Feni");
  const [harvestDate, setHarvestDate] = useState("");
  const [description, setDescription] = useState("");
  const [aiPriceSuggested, setAiPriceSuggested] = useState(0);

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
    setPricePerKg(suggestion); // Auto-fill form input!
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

  // Farmer's own listings and orders
  const farmerListings = listings;
  const farmerOrders = orders;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Available Cash wallet */}
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

        {/* Escrow locked wallet */}
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

        {/* Telemetry info card */}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* LEFT TWO COLUMNS: Forms and Listing List (Span 2) */}
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
                {/* Crop selector */}
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
                    <option value="onion">Local Onion (পেঁয়াজ)</option>
                    <option value="chili">Green Chili (কাঁচামরিচ)</option>
                    <option value="lentil">Lentil (ডাল)</option>
                  </select>
                </div>

                {/* Crop Variety */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Variety / Brand (জাত বা কোয়ালিটি)</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Miniket (মিনিকেট) / BR-28 / Organic Red"
                    className="glass-input text-sm"
                  />
                </div>

                {/* Stock Quantity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Estimated Quantity (মোট পরিমাণ - কেজি)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={quantity || ""}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    placeholder="e.g. 500 (in kilograms)"
                    className="glass-input font-mono text-sm"
                  />
                </div>

                {/* Location */}
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
                    <option value="Laksam, Comilla">Laksam, Comilla</option>
                  </select>
                </div>

                {/* Harvest date */}
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

                {/* Pricing / AI recommendation */}
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

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slateforest-400">Stock Description (ফসল বিবরণ)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. High nutrient black soil harvest, chemically minimized, ready for immediate delivery."
                  className="glass-input text-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
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

          {/* ACTIVE HARVEST LISTINGS TABLE */}
          <div className="flex flex-col gap-3">
            {farmerListings.length === 0 ? (
              <div className="glass-card p-8 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
                <FileText className="w-10 h-10 text-slateforest-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-white">No Active Harvests Listed</h4>
                <p className="text-xs text-slateforest-500 max-w-xs mx-auto mt-1">
                  Click the "List New Harvest" button above to publish your upcoming yields and find regional bulk buyers.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {farmerListings.map((listing) => (
                  <div key={listing.id} className="glass-card p-5 flex flex-col gap-4 bg-slateforest-850/40 relative overflow-hidden">
                    {/* Visual Crop Badge Overlay */}
                    <div className="absolute right-4 top-4 text-3xl opacity-35">
                      {listing.cropType === "rice" ? "🌾" : listing.cropType === "potato" ? "🥔" : listing.cropType === "tomato" ? "🍅" : listing.cropType === "onion" ? "🧅" : listing.cropType === "chili" ? "🌶️" : "🫘"}
                    </div>

                    {/* Meta info */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          listing.status === "available" 
                            ? "bg-agri-500/10 border-agri-500/20 text-agri-400" 
                            : listing.status === "escrowed"
                            ? "bg-market-gold/10 border-market-gold/20 text-market-gold"
                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                        }`}>
                          {listing.status === "available" ? "Direct Market Available" : listing.status === "escrowed" ? "Funds Escrowed" : "Sold & Settled"}
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

                    {/* Stock telemetry metrics */}
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

                    {/* Listing Footer */}
                    <div className="flex justify-between items-center text-[10px] text-slateforest-500 border-t border-slateforest-800 pt-3">
                      <span>Origin: {listing.location.split(",")[0]}</span>
                      <span className="text-agri-500 font-semibold">direct B2B</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Active Escrow Orders Tracker */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-5 bg-slateforest-800/40 border-b border-slateforest-700/50">
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Live Escrow Orders Log
            </h3>
            <p className="text-xs text-slateforest-400 mt-0.5">
              Track funds verification and logistics status on active sales.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            {farmerOrders.length === 0 ? (
              <div className="glass-card p-6 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
                <p className="text-xs">No active escrow purchases logged yet.</p>
              </div>
            ) : (
              farmerOrders.map((order) => (
                <div key={order.id} className="glass-card p-5 bg-slateforest-900 border-slateforest-700 flex flex-col gap-4">
                  
                  {/* Title Bar */}
                  <div className="flex justify-between items-start border-b border-slateforest-800 pb-3">
                    <div>
                      <span className="font-mono text-[9px] text-slateforest-500 block">{order.id}</span>
                      <h4 className="text-xs font-semibold text-white capitalize">
                        {order.cropType} Sale ({order.quantity} kg)
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slateforest-500 block">Total Payout</span>
                      <span className="font-mono font-bold text-agri-400 text-sm">{order.totalAmount.toLocaleString()} BDT</span>
                    </div>
                  </div>

                  {/* Escrow Timeline Tracker */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[9px] font-bold text-slateforest-400 uppercase tracking-widest block">
                      Escrow Order Milestone Timeline:
                    </span>
                    
                    <div className="flex flex-col gap-2 text-xs">
                      {/* Step 1: Payment locked */}
                      <div className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-agri-500/20 border border-agri-500/40 text-agri-400 flex items-center justify-center shrink-0 mt-0.5">
                          ✓
                        </div>
                        <div>
                          <span className="font-bold text-white block">Payment Escrowed</span>
                          <span className="text-[10px] text-slateforest-400 block mt-0.5">
                            SSLCommerz locked BDT {order.totalAmount.toLocaleString()} via MFS gateway ({order.paymentGateway}).
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Transit status */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          order.deliveryStatus !== "ordered"
                            ? "bg-agri-500/20 border border-agri-500/40 text-agri-400"
                            : "bg-slateforest-950 border border-slateforest-800 text-slateforest-600"
                        }`}>
                          {order.deliveryStatus !== "ordered" ? "✓" : "2"}
                        </div>
                        <div>
                          <span className={`font-bold block ${order.deliveryStatus !== "ordered" ? "text-white" : "text-slateforest-500"}`}>
                            Logistics Picked Up
                          </span>
                          <span className="text-[10px] text-slateforest-400 block mt-0.5">
                            {order.deliveryStatus === "transit" 
                              ? "Driver claimed task. Harvest in transit to buyer's warehouse."
                              : order.deliveryStatus === "delivered"
                              ? "Driver pickup complete and verified."
                              : "Pending driver dispatch from local terminal."}
                          </span>
                        </div>
                      </div>

                      {/* Step 3: Delivery release */}
                      <div className="flex items-start gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          order.paymentStatus === "released"
                            ? "bg-agri-500/20 border border-agri-500/40 text-agri-400"
                            : "bg-slateforest-950 border border-slateforest-800 text-slateforest-600 animate-pulse"
                        }`}>
                          {order.paymentStatus === "released" ? "✓" : "3"}
                        </div>
                        <div>
                          <span className={`font-bold block ${order.paymentStatus === "released" ? "text-white" : "text-slateforest-500"}`}>
                            Escrow Released to Wallet
                          </span>
                          <span className="text-[10px] text-slateforest-400 block mt-0.5">
                            {order.paymentStatus === "released"
                              ? "Logistics QR confirmed. Funds transferred directly into farmer wallet."
                              : `Awaiting delivery handshake. Share Code: ${order.verificationCode} with driver.`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buyer detail panel */}
                  <div className="bg-slateforest-950/40 p-3 rounded-lg border border-slateforest-800 text-[10px] text-slateforest-400 flex flex-col gap-1">
                    <span>Buyer: <span className="text-white font-semibold">{order.buyerName}</span></span>
                    <span>Shipping Address: <span className="text-white font-semibold">{order.buyerPhone} (Dhaka Hub)</span></span>
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
