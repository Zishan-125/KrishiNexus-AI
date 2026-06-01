"use client";

import React, { useState } from "react";
import { UserRole, CropListing, EscrowOrder, CropCategory } from "@/types";
import Sidebar from "@/components/Sidebar";
import FarmerPortal from "@/components/FarmerPortal";
import Marketplace from "@/components/Marketplace";
import LogisticsHub from "@/components/LogisticsHub";
import PriceTrends from "@/components/PriceTrends";
import CropDoctor from "@/components/CropDoctor";
import AuthPortal from "@/components/AuthPortal";
import { 
  Sprout, 
  TrendingUp, 
  Activity, 
  HelpCircle,
  BellRing,
  CheckCircle2,
  X
} from "lucide-react";

// Pre-seeded high-fidelity listings
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
    farmerId: "FARM_FENI_89",
    farmerName: "Mofizul Islam",
    farmerPhone: "01887654321",
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
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    emailOrPhone: string;
    role: UserRole;
  } | null>(null);

  const [activeRole, setActiveRole] = useState<UserRole>("farmer");
  const [listings, setListings] = useState<CropListing[]>(initialListings);
  const [orders, setOrders] = useState<EscrowOrder[]>([]);
  
  // Simulated Wallet telemetry
  const [farmerBalance, setFarmerBalance] = useState<number>(45000);
  const [farmerPending, setFarmerPending] = useState<number>(0);
  const [logisticsBalance, setLogisticsBalance] = useState<number>(3200);
  
  // Real-time Notification system
  const [notification, setNotification] = useState<{
    title: string;
    msg: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  const showNotification = (title: string, msg: string, type: "success" | "info" | "warning" = "info") => {
    setNotification({ title, msg, type });
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  // Sign In / Authenticate
  const handleLogin = (role: UserRole, name: string, emailOrPhone: string) => {
    setCurrentUser({ name, emailOrPhone, role });
    setIsAuthenticated(true);
    setActiveRole(role); // Auto-navigate to their primary dashboard workspace!

    showNotification(
      "Authenticated Successfully!",
      `Welcome back, ${name}. Loaded active ${role} wallet profile.`,
      "success"
    );
  };

  // Sign Out
  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    showNotification(
      "Signed Out",
      "Successfully terminated active agritech wallet session.",
      "info"
    );
  };

  // Farmer publishes new yield listing callback
  const handleAddListing = (
    newListing: Omit<CropListing, "id" | "farmerId" | "farmerName" | "farmerPhone" | "status">
  ) => {
    const listId = `LIST_${Math.floor(100 + Math.random() * 900)}`;
    const freshListing: CropListing = {
      ...newListing,
      id: listId,
      farmerId: "FARM_FENI_77", // Linked to default farmer profile
      farmerName: currentUser ? currentUser.name : "Abul Kalam",
      farmerPhone: currentUser ? currentUser.emailOrPhone : "01712345678",
      status: "available"
    };

    setListings([freshListing, ...listings]);
    showNotification(
      "Listing Published Successfully!",
      `Your ${newListing.quantity} Kg of ${newListing.cropType} (${newListing.variety}) is now live on the B2B Marketplace.`,
      "success"
    );
  };

  // Merchant places order callback -> Locks money into Escrow
  const handleOrderListing = (
    listingId: string,
    gateway: "bkash" | "nagad" | "upay" | "card"
  ) => {
    const activeList = listings.find((l) => l.id === listingId);
    if (!activeList) return;

    // Update listing status
    setListings(listings.map(l => l.id === listingId ? { ...l, status: "escrowed" } : l));

    // Create Escrow Order
    const orderId = `ORD_${Math.floor(1000 + Math.random() * 9000)}`;
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit QR PIN
    
    const newOrder: EscrowOrder = {
      id: orderId,
      listingId,
      buyerId: "MERCH_DHK_44",
      buyerName: currentUser ? currentUser.name : "Shwapno Supermarket Corp",
      buyerPhone: currentUser ? currentUser.emailOrPhone : "01998877665",
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
    
    // Add amount to Farmer's Pending Escrow wallet
    setFarmerPending(prev => prev + activeList.totalAmount);

    showNotification(
      "SSLCommerz Escrow Established!",
      `BDT ${activeList.totalAmount.toLocaleString()} has been locked in escrow for Order ${orderId}. Logistics notified for Feni pickup.`,
      "success"
    );
  };

  // Driver claims transit task callback
  const handleStartTransit = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, deliveryStatus: "transit", logisticsId: "LOG_FENI_09" } : o));
    
    showNotification(
      "Logistics Task Claimed!",
      `Driver assigned to Order ${orderId}. Cargo is now moving from Feni to Dhaka.`,
      "info"
    );
  };

  // Driver delivers & verifies QR Code -> Webhook triggers Escrow Release to Farmer
  const handleConfirmDelivery = (orderId: string) => {
    const activeOrder = orders.find(o => o.id === orderId);
    if (!activeOrder) return;

    // Update order status
    setOrders(orders.map(o => o.id === orderId ? { 
      ...o, 
      paymentStatus: "released", 
      deliveryStatus: "delivered" 
    } : o));

    // Update listing status
    setListings(listings.map(l => l.id === activeOrder.listingId ? { ...l, status: "completed" } : l));

    // Webhook wallet adjustments
    const cargoValue = activeOrder.totalAmount;
    const logisticsFee = Math.round(cargoValue * 0.08); // 8% fee

    setFarmerPending(prev => Math.max(0, prev - cargoValue));
    setFarmerBalance(prev => prev + cargoValue);
    setLogisticsBalance(prev => prev + logisticsFee);

    showNotification(
      "Webhook Released: Escrow Dispatched!",
      `Delivery verified! Webhook released BDT ${cargoValue.toLocaleString()} to Farmer wallet and BDT ${logisticsFee.toLocaleString()} to Logistics partner.`,
      "success"
    );
  };

  // Render Login page if Guest session
  if (!isAuthenticated) {
    return <AuthPortal onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen bg-slateforest-900 bg-dot-grid flex flex-col">
      
      {/* Dynamic Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up w-full max-w-md">
          <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 relative ${
            notification.type === "success" 
              ? "bg-agri-500/10 border-agri-500/30 text-agri-400" 
              : notification.type === "warning"
              ? "bg-market-gold/10 border-market-gold/20 text-market-gold"
              : "bg-blue-500/10 border-blue-500/30 text-blue-400"
          }`}>
            <BellRing className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
                {notification.title}
              </h4>
              <p className="text-xs text-slateforest-200 mt-1 leading-relaxed">
                {notification.msg}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="absolute right-3 top-3 text-slateforest-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Portal Shell */}
      <div className="flex flex-col lg:flex-row flex-1 p-4 lg:p-6 gap-6 max-w-7xl w-full mx-auto animate-fade-in-up">
        
        {/* SIDEBAR NAVIGATION */}
        <Sidebar 
          activeRole={activeRole} 
          onRoleChange={setActiveRole}
          farmerBalance={farmerBalance}
          farmerPending={farmerPending}
          logisticsBalance={logisticsBalance}
          currentUser={currentUser}
          onSignOut={handleSignOut}
        />

        {/* WORKSPACE AREA */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Main workspace section based on switch role */}
          <div className="flex-1">
            {activeRole === "farmer" && (
              <FarmerPortal 
                listings={listings.filter(l => l.farmerId === "FARM_FENI_77")}
                onAddListing={handleAddListing}
                orders={orders.filter(o => o.farmerId === "FARM_FENI_77")}
                walletBalance={farmerBalance}
                pendingEscrow={farmerPending}
              />
            )}

            {activeRole === "merchant" && (
              <Marketplace 
                listings={listings}
                onOrderListing={handleOrderListing}
              />
            )}

            {activeRole === "logistics" && (
              <LogisticsHub 
                orders={orders}
                onStartTransit={handleStartTransit}
                onConfirmDelivery={handleConfirmDelivery}
                logisticsBalance={logisticsBalance}
              />
            )}

            {activeRole === "admin" && (
              <PriceTrends />
            )}
          </div>

          {/* DUAL PURPOSE CENTERPIECE: Global AI Crop Doctor Panel */}
          {activeRole !== "admin" && (
            <div className="border-t border-slateforest-800/80 pt-6">
              <CropDoctor />
            </div>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slateforest-800/50 mt-auto bg-slateforest-950/40 text-center text-xs text-slateforest-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 KrishiNexus AI. Empowering regional farmers via direct B2B supply-chains and neural yield diagnostics.</p>
          <div className="flex gap-4">
            <span className="hover:text-agri-400 cursor-pointer">Security Protocol</span>
            <span className="hover:text-agri-400 cursor-pointer">SSL Sandbox Escrow</span>
            <span className="hover:text-agri-400 cursor-pointer font-bold text-agri-500">Feni Node #4</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
