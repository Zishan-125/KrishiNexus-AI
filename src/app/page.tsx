

"use client";

import React, { useState, useEffect } from "react";
import { UserRole, CropListing, EscrowOrder } from "@/types";
import Sidebar from "@/components/Sidebar";
import FarmerPortal from "@/components/FarmerPortal";
import Marketplace from "@/components/Marketplace";
import LogisticsHub from "@/components/LogisticsHub";
import PriceTrends from "@/components/PriceTrends";
import CropDoctor from "@/components/CropDoctor";
import { 
  BellRing,
  X,
  LayoutDashboard,
  ShoppingBag,
  Truck,
  TrendingUp,
  Activity
} from "lucide-react";

// Pre-seeded high-fidelity structural listings to guarantee dashboards populate
const initialListings: CropListing[] = [
  {
    id: "LIST_001",
    farmerId: "FARM_FENI_77",
    farmerName: "Abul Kalam",
    farmerPhone: "01712345678",
    cropType: "rice",
    variety: "Premium Miniket (মিনিকেট)",
    quantity: 800,
    pricePerKg: 65,
    totalAmount: 52000,
    harvestDate: "2026-06-15",
    location: "Daganbhuiyan, Feni",
    description: "High-grade Miniket rice. Chemically minimized, organic manure only. Ready for bulk shipping.",
    status: "available",
    recommendedPrice: 65
  },
  {
    id: "LIST_002",
    farmerId: "FARM_FENI_77",
    farmerName: "Abul Kalam",
    farmerPhone: "01712345678",
    cropType: "potato",
    variety: "Diamant Holland Potato (আলু)",
    quantity: 1200,
    pricePerKg: 42,
    totalAmount: 50400,
    harvestDate: "2026-06-18",
    location: "Feni Sadar, Feni",
    description: "Export-quality Holland potato. Harvested from highly aerated soil beds. High durability.",
    status: "available",
    recommendedPrice: 42
  },
  {
    id: "LIST_003",
    farmerId: "FARM_COMI_12",
    farmerName: "Rafiqul Islam",
    farmerPhone: "01991223344",
    cropType: "tomato",
    variety: "Organic Hybrid Cherry Tomato (টমেটো)",
    quantity: 250,
    pricePerKg: 68,
    totalAmount: 17000,
    harvestDate: "2026-06-12",
    location: "Chauddagram, Comilla",
    description: "Juicy organic cherry tomatoes. Highly loaded in antioxidants. Perfect for premium retail stores.",
    status: "available",
    recommendedPrice: 68
  }
];

export default function Home() {
  // SSR Hydration Mount Check Gate
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // Auto-Login Profile Configuration: Pre-seeded explicitly as Abul Kalam to match the items dataset
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    emailOrPhone: string;
    role: UserRole;
  } | null>({
    name: "Abul Kalam",
    emailOrPhone: "01712345678",
    role: "farmer"
  });

  const [activeRole, setActiveRole] = useState<UserRole>("farmer");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Data State Arrays
  const [listings, setListings] = useState<CropListing[]>(initialListings);
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  
  // Wallet Telemetry Metrics loaded with baseline data
  const [farmerBalance, setFarmerBalance] = useState<number>(45000);
  const [farmerPending, setFarmerPending] = useState<number>(0);
  const [logisticsBalance, setLogisticsBalance] = useState<number>(3200);
  
  const [notification, setNotification] = useState<{
    title: string;
    msg: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const showNotification = (title: string, msg: string, type: "success" | "info" | "warning" = "info") => {
    setNotification({ title, msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleAddListing = (
    newListing: Omit<CropListing, "id" | "farmerId" | "farmerName" | "farmerPhone" | "status">
  ) => {
    const listId = `LIST_${Math.floor(100 + Math.random() * 900)}`;
    const freshListing: CropListing = {
      ...newListing,
      id: listId,
      farmerId: "FARM_FENI_77", 
      farmerName: currentUser ? currentUser.name : "Abul Kalam",
      farmerPhone: currentUser ? currentUser.emailOrPhone : "01712345678",
      status: "available"
    };

    setListings([freshListing, ...listings]);
    showNotification(
      "Listing Published Successfully!",
      `Your ${newListing.quantity} Kg of ${newListing.cropType} is now live on the B2B Marketplace.`,
      "success"
    );
  };

  const handleOrderListing = (listingId: string, gateway: "bkash" | "nagad" | "upay" | "card") => {
    const activeList = listings.find((l) => l.id === listingId);
    if (!activeList) return;

    setListings(listings.map(l => l.id === listingId ? { ...l, status: "escrowed" } : l));

    const orderId = `ORD_${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    const newOrder: EscrowOrder = {
      id: orderId,
      listingId,
      buyerId: "MERCH_DHK_44",
      buyerName: "Shwapno Supermarket Corp",
      buyerPhone: "01998877665",
      farmerId: activeList.farmerId,
      farmerName: activeList.farmerName,
      cropType: activeList.cropType,
      quantity: activeList.quantity,
      totalAmount: activeList.totalAmount,
      paymentStatus: "escrowed",
      deliveryStatus: "ordered",
      paymentGateway: gateway,
      logisticsId: null,
      orderDate: new Date().toISOString().split("T")[0],
      verificationCode
    };

    setOrders([newOrder, ...orders]);
    setFarmerPending(prev => prev + activeList.totalAmount);

    showNotification(
      "Escrow Established!",
      `BDT ${activeList.totalAmount.toLocaleString()} locked securely for Order ${orderId}.`,
      "success"
    );
  };

  const handleStartTransit = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, deliveryStatus: "transit", logisticsId: "LOG_FENI_09" } : o));
    showNotification("Logistics Task Claimed!", "Cargo is in transit.", "info");
  };

  const handleConfirmDelivery = (orderId: string) => {
    const activeOrder = orders.find(o => o.id === orderId);
    if (!activeOrder) return;

    setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: "released", deliveryStatus: "delivered" } : o));
    setListings(listings.map(l => l.id === activeOrder.listingId ? { ...l, status: "completed" } : l));

    const cargoValue = activeOrder.totalAmount;
    const logisticsFee = Math.round(cargoValue * 0.08);

    setFarmerPending(prev => Math.max(0, prev - cargoValue));
    setFarmerBalance(prev => prev + cargoValue);
    setLogisticsBalance(prev => prev + logisticsFee);

    showNotification("Webhook Released!", "Funds successfully dispatched to native wallets.", "success");
  };

  const handleRoleTransition = (targetRole: UserRole) => {
    setActiveRole(targetRole);
    if (targetRole === "farmer") setActiveTab("dashboard");
    else if (targetRole === "merchant") setActiveTab("marketplace");
    else if (targetRole === "logistics") setActiveTab("logistics");
    else if (targetRole === "admin") setActiveTab("trends");
  };

  if (!hasMounted) {
    return <div className="min-h-screen bg-[#0b1315]" />;
  }

  return (
    <main className="min-h-screen bg-[#0b1315] text-slate-100 flex flex-col">
      
      {/* Toast Notification Mount Target */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-fade-in-up">
          <div className={`p-4 rounded-xl border backdrop-blur-md flex items-start gap-3 relative bg-emerald-950/80 border-emerald-500/30 text-emerald-400`}>
            <BellRing className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">{notification.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{notification.msg}</p>
            </div>
            <button onClick={() => setNotification(null)} className="absolute right-3 top-3 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* CORE FRAMEWORK CONTAINER: 2-Column Responsive Flex Grid layout */}
      <div className="flex flex-col md:flex-row flex-1 w-full min-h-screen">
        
        {/* SIDEBAR PANEL BAR ANCHOR */}
        <div className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-[#070d0e]">
          <Sidebar 
            activeRole={activeRole} 
            onRoleChange={handleRoleTransition}
            farmerBalance={farmerBalance}
            farmerPending={farmerPending}
            logisticsBalance={logisticsBalance}
            currentUser={currentUser}
            onSignOut={() => setCurrentUser(null)}
          />
        </div>

        {/* CONTROLLER WORKSPACE WINDOW */}
        <div className="flex-1 flex flex-col p-4 lg:p-6 gap-6 overflow-x-hidden">
          
          {/* Workspace Switcher Component Header */}
          <div className="bg-[#070d0e] border border-slate-800/80 p-2 rounded-xl flex items-center gap-2 overflow-x-auto shadow-lg">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 px-3 border-r border-slate-800 shrink-0">
              Active Module:
            </span>
            <button 
              onClick={() => { setActiveTab("dashboard"); setActiveRole("farmer"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 ${activeTab === "dashboard" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Farmer Dashboard
            </button>
            <button 
              onClick={() => { setActiveTab("marketplace"); setActiveRole("merchant"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 ${activeTab === "marketplace" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              B2B Marketplace
            </button>
            <button 
              onClick={() => { setActiveTab("logistics"); setActiveRole("logistics"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 ${activeTab === "logistics" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
            >
              <Truck className="w-3.5 h-3.5" />
              Logistics Hub
            </button>
            <button 
              onClick={() => { setActiveTab("trends"); setActiveRole("admin"); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 ${activeTab === "trends" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Market Trends
            </button>
            <button 
              onClick={() => setActiveTab("doctor")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-semibold transition-all shrink-0 ${activeTab === "doctor" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`}
            >
              <Activity className="w-3.5 h-3.5" />
              Neural Crop Doctor
            </button>
          </div>

          {/* Conditional Sub-View Workspace Gateway */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <FarmerPortal 
                listings={listings.filter(l => l.farmerId === "FARM_FENI_77")}
                onAddListing={handleAddListing}
                orders={orders}
                walletBalance={farmerBalance}
                pendingEscrow={farmerPending}
              />
            )}

            {activeTab === "marketplace" && (
              <Marketplace 
                listings={listings}
                onOrderListing={handleOrderListing}
              />
            )}

            {activeTab === "logistics" && (
              <LogisticsHub 
                orders={orders}
                onStartTransit={handleStartTransit}
                onConfirmDelivery={handleConfirmDelivery}
                logisticsBalance={logisticsBalance}
              />
            )}

            {activeTab === "trends" && <PriceTrends />}
            {activeTab === "doctor" && <CropDoctor />}
          </div>

          {/* Permanent lower contextual footer layout mounting */}
          {activeTab !== "trends" && activeTab !== "doctor" && (
            <div className="border-t border-slate-800/80 pt-6">
              <CropDoctor />
            </div>
          )}

        </div>
      </div>

      {/* Footer System info */}
      <footer className="py-4 border-t border-slate-800 bg-[#070d0e] text-center text-[11px] text-slate-500 shrink-0">
        <p>© 2026 KrishiNexus AI. Secure B2B Supply-Chains and Neural Yield Diagnostics. | Feni Node Active</p>
      </footer>
    </main>
  );
}