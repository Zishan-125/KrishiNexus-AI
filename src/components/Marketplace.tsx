import React, { useState } from "react";
import { CropListing, CropCategory } from "@/types";
import { 
  Search, 
  MapPin, 
  Tag, 
  Calendar, 
  Filter, 
  Truck, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  ShoppingBag,
  LogOut,
  User,
  ShieldCheck
} from "lucide-react";
import PaymentGateway from "./PaymentGateway";
import AuthPortal from "./AuthPortal"; // Import your authentication component

interface MarketplaceProps {
  listings: CropListing[];
  onOrderListing: (listingId: string, gateway: "bkash" | "nagad" | "upay" | "card") => void;
}

export default function Marketplace({ listings, onOrderListing }: MarketplaceProps) {
  // --- AUTHENTICATION STATE LAYERS ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Toggle to false to test the fallback login wall
  const [currentUser, setCurrentUser] = useState({
    name: "Zishan Al Mamun",
    role: "B2B Corporate Buyer",
    district: "Feni"
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeDistrict, setActiveDistrict] = useState<string>("all");
  const [selectedPurchaseListing, setSelectedPurchaseListing] = useState<CropListing | null>(null);

  const categories: { id: string; label: string; icon: string }[] = [
    { id: "all", label: "All Crops", icon: "🍱" },
    { id: "rice", label: "Aman Rice", icon: "🌾" },
    { id: "potato", label: "Potato", icon: "🥔" },
    { id: "tomato", label: "Tomato", icon: "🍅" },
    { id: "onion", label: "Onion", icon: "🧅" },
    { id: "chili", label: "Green Chili", icon: "🌶️" }
  ];

  const districts = ["all", "Feni", "Comilla"];

  // Filter listings based on search, category, and district
  const filteredListings = listings.filter((listing) => {
    if (listing.status !== "available") return false;

    const matchesSearch = 
      listing.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "all" || listing.cropType === activeCategory;
    
    const matchesDistrict = 
      activeDistrict === "all" || 
      listing.location.toLowerCase().includes(activeDistrict.toLowerCase());

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleCheckoutSuccess = (method: "bkash" | "nagad" | "upay" | "card") => {
    if (selectedPurchaseListing) {
      onOrderListing(selectedPurchaseListing.id, method);
      setSelectedPurchaseListing(null);
    }
  };

  const handleLogOut = () => {
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // 🛡️ CONDITIONAL RENDER: If unauthorized, swap the whole view out for your AuthPortal portal screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in-up">
        <div className="w-full max-w-md">
          <AuthPortal />
          <button 
            onClick={handleLoginSuccess}
            className="mt-4 text-xs text-center w-full text-agri-400 underline hover:text-agri-300 cursor-pointer"
          >
            Bypass & Force Sign In (Demo Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* 🔐 NEW ACCENT SECURITY HEADER (Log Out / Sign In Meta Tracker) */}
      <div className="w-full glass-card p-4 bg-slateforest-900/80 border border-slateforest-800 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-agri-500/10 border border-agri-500/30 flex items-center justify-center text-agri-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white tracking-wide">{currentUser.name}</h4>
              <span className="text-[10px] bg-agri-500/20 text-agri-400 font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-agri-500/30">
                <ShieldCheck className="w-3 h-3" /> {currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slateforest-500">Active Procurement Zone: {currentUser.district}, Bangladesh</p>
          </div>
        </div>

        <button
          onClick={handleLogOut}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out (লগ আউট)
        </button>
      </div>
      
      {/* FILTER & SEARCH HUB */}
      <div className="glass-card p-6 bg-slateforest-800/60 flex flex-col gap-4 border-slateforest-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-white tracking-wide flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-agri-400" />
              Direct B2B Marketplace (ফসল ক্রয়-বিক্রয়)
            </h2>
            <p className="text-xs text-slateforest-400">
              Procure directly from regional farmers in Feni and Comilla. Bypass all middlemen commissions.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search variety, farmer, or keyword..."
              className="glass-input pr-12 text-sm h-12"
            />
            <Search className="w-5 h-5 text-slateforest-500 absolute right-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Category Icons Selector */}
        <div className="flex flex-wrap items-center justify-between border-t border-slateforest-700/50 pt-4 gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-agri-500 text-white shadow-lg shadow-agri-600/20"
                    : "bg-slateforest-900/50 text-slateforest-400 border border-slateforest-700/60 hover:border-slateforest-500 hover:text-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* District Select Dropdown */}
          <div className="flex items-center gap-2.5 text-xs text-slateforest-400 bg-slateforest-950/40 px-3 py-2 rounded-xl border border-slateforest-800">
            <Filter className="w-4 h-4 text-agri-400" />
            <span>District Origin:</span>
            <div className="flex gap-1.5 font-semibold text-white">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDistrict(d)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    activeDistrict === d ? "bg-agri-500 text-white" : "hover:text-agri-400"
                  }`}
                >
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CROP DIRECTORY GRID */}
      {filteredListings.length === 0 ? (
        <div className="glass-card p-12 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
          <ShoppingBag className="w-12 h-12 text-slateforest-600 mx-auto mb-2 animate-bounce" />
          <h4 className="text-sm font-semibold text-white">No Crop Listings Match Your Filter</h4>
          <p className="text-xs text-slateforest-500 max-w-sm mx-auto mt-1">
            Try adjusting your search terms or selecting another crop category to explore available yields.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const logisticsFee = Math.round(listing.totalAmount * 0.08); // 8% fee
            const grandTotal = listing.totalAmount + logisticsFee;
            
            return (
              <div 
                key={listing.id} 
                className="glass-card glass-card-hover p-6 flex flex-col h-full bg-slateforest-850/40 relative overflow-hidden"
              >
                {/* Brand icon / Category background tag */}
                <div className="absolute right-6 top-6 text-4xl opacity-20 pointer-events-none">
                  {listing.cropType === "rice" ? "🌾" : listing.cropType === "potato" ? "🥔" : listing.cropType === "tomato" ? "🍅" : listing.cropType === "onion" ? "🧅" : listing.cropType === "chili" ? "🌶️" : "🫘"}
                </div>

                {/* Seller Meta info */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-full bg-slateforest-900 border border-slateforest-700 flex items-center justify-center font-bold text-xs text-white">
                    {listing.farmerName.split(" ")[0][0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {listing.farmerName}
                    </h4>
                    <p className="text-[10px] text-slateforest-500">
                      Farmer ID: {listing.farmerId}
                    </p>
                  </div>
                </div>

                {/* Crop Name */}
                <div className="mb-3">
                  <h3 className="text-base font-display font-bold text-white tracking-wide capitalize flex items-center gap-1.5">
                    {listing.cropType}
                    <span className="text-xs font-normal text-slateforest-400">({listing.variety})</span>
                  </h3>
                  
                  {/* Origin tags */}
                  <div className="flex items-center gap-1 text-[11px] text-slateforest-400 mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Farm: {listing.location}</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="flex flex-col gap-2 border-t border-b border-slateforest-800 py-3.5 my-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slateforest-400">Available Stock:</span>
                    <span className="font-mono font-bold text-white">{listing.quantity.toLocaleString()} Kg</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slateforest-400">Direct Unit Rate:</span>
                    <span className="font-mono font-bold text-agri-400">{listing.pricePerKg} BDT / Kg</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slateforest-400">Harvest Date:</span>
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-agri-400" />
                      {listing.harvestDate}
                    </span>
                  </div>
                </div>

                {/* Direct Purchase calculation details */}
                <div className="bg-slateforest-950/50 rounded-xl p-3 border border-slateforest-800/80 flex justify-between items-center mb-6">
                  <div>
                    <span className="text-[9px] text-slateforest-500 uppercase tracking-widest block font-bold mb-0.5">
                      SSL Escrow Lock
                    </span>
                    <span className="font-mono font-extrabold text-white text-sm">
                      {grandTotal.toLocaleString()} BDT
                    </span>
                  </div>
                  
                  <div className="text-[10px] text-slateforest-500 text-right flex flex-col">
                    <span>Crop: {listing.totalAmount.toLocaleString()} BDT</span>
                    <span className="text-blue-400 flex items-center justify-end gap-0.5">
                      <Truck className="w-3 h-3" /> Delivery: {logisticsFee} BDT
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => setSelectedPurchaseListing(listing)}
                  className="glass-button-accent w-full text-xs font-extrabold tracking-wide uppercase mt-auto flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Buy Direct (এসক্রো পেমেন্ট)
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* SSLCOMMERZ GATEWAY OVERLAY MODAL */}
      {selectedPurchaseListing && (
        <PaymentGateway 
          listing={selectedPurchaseListing}
          onClose={() => setSelectedPurchaseListing(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

    </div>
  );
}