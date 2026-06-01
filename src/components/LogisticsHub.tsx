import React, { useState } from "react";
import { EscrowOrder, UserProfile } from "@/types";
import { 
  Truck, 
  MapPin, 
  Navigation, 
  ShieldCheck, 
  QrCode, 
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight
} from "lucide-react";

interface LogisticsHubProps {
  orders: EscrowOrder[];
  onStartTransit: (orderId: string) => void;
  onConfirmDelivery: (orderId: string) => void;
  logisticsBalance: number;
}

export default function LogisticsHub({ 
  orders, 
  onStartTransit, 
  onConfirmDelivery,
  logisticsBalance 
}: LogisticsHubProps) {
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "completed">("pending");
  const [scanningCode, setScanningCode] = useState<string | null>(null);
  const [typedCode, setTypedCode] = useState("");
  const [scanError, setScanError] = useState("");

  const pendingTasks = orders.filter(o => o.paymentStatus === "escrowed" && o.deliveryStatus === "ordered");
  const activeTasks = orders.filter(o => o.paymentStatus === "escrowed" && o.deliveryStatus === "transit");
  const completedTasks = orders.filter(o => o.paymentStatus === "released");

  const handleClaimRun = (orderId: string) => {
    onStartTransit(orderId);
  };

  const handleVerifyQR = (order: EscrowOrder) => {
    setScanningCode(order.id);
    setTypedCode("");
    setScanError("");
  };

  const handleConfirmCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanningCode) return;
    
    const matchingOrder = orders.find(o => o.id === scanningCode);
    if (matchingOrder) {
      if (typedCode.trim() === matchingOrder.verificationCode) {
        onConfirmDelivery(scanningCode);
        setScanningCode(null);
        setTypedCode("");
      } else {
        setScanError("Invalid Handshake Code! Please double-check with the Merchant.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Wallet Summary */}
      <div className="glass-card p-5 bg-gradient-to-br from-blue-500/10 to-slateforest-800/60 border-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider">
            Logistics Terminal Earnings
          </span>
          <Truck className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-3xl font-display font-extrabold text-white tracking-wide font-mono">
          {logisticsBalance.toLocaleString()} <span className="text-lg font-sans font-normal text-slateforest-400">BDT</span>
        </h2>
        <p className="text-[10px] text-slateforest-400 mt-1">
          Settled delivery fees. Payouts are dispatched automatically upon QR delivery handshake verification.
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="glass-card p-4 bg-slateforest-800/60 flex items-center justify-between border-slateforest-700/50">
        <div className="flex gap-2">
          {/* Pending Runs */}
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "pending"
                ? "bg-blue-500 text-white"
                : "bg-slateforest-900/50 text-slateforest-400 hover:text-white"
            }`}
          >
            Pending Pickup Tasks ({pendingTasks.length})
          </button>

          {/* In Transit */}
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "active"
                ? "bg-market-gold text-slateforest-950"
                : "bg-slateforest-900/50 text-slateforest-400 hover:text-white"
            }`}
          >
            Active In-Transit ({activeTasks.length})
          </button>

          {/* Settled Deliveries */}
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === "completed"
                ? "bg-agri-500 text-white"
                : "bg-slateforest-900/50 text-slateforest-400 hover:text-white"
            }`}
          >
            Completed Jobs ({completedTasks.length})
          </button>
        </div>

        <span className="text-[10px] text-slateforest-500 font-mono hidden md:inline">
          Terminal Status: Ready for Dispatch
        </span>
      </div>

      {/* TASKS LIST */}
      <div className="flex flex-col gap-4">
        
        {/* PENDING JOBS */}
        {activeTab === "pending" && (
          pendingTasks.length === 0 ? (
            <div className="glass-card p-12 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
              <Clock className="w-10 h-10 text-slateforest-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-white">No Shipments Awaiting Dispatch</h4>
              <p className="text-xs text-slateforest-500 max-w-sm mx-auto mt-1">
                When merchants buy harvests, shipping requests will populate here instantly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingTasks.map((order) => {
                const deliveryFee = Math.round(order.totalAmount * 0.08); // 8% fee
                
                return (
                  <div key={order.id} className="glass-card p-5 bg-slateforest-850/40 flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-slateforest-800 pb-3">
                      <div>
                        <span className="font-mono text-[9px] text-slateforest-500 block">{order.id}</span>
                        <h4 className="text-sm font-display font-semibold text-white capitalize">
                          {order.cropType} ({order.quantity} kg)
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slateforest-500 block">Transit Fee</span>
                        <span className="font-mono font-bold text-blue-400">{deliveryFee.toLocaleString()} BDT</span>
                      </div>
                    </div>

                    {/* Routing Details */}
                    <div className="flex flex-col gap-2.5 text-xs text-slateforest-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-agri-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slateforest-500 block font-bold uppercase">Pickup Point (Farmer)</span>
                          <span className="font-semibold text-white">{order.farmerName}</span>
                          <span className="text-slateforest-400 block text-[10px]">Feni District Terminal</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Navigation className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slateforest-500 block font-bold uppercase">Shipping Point (Merchant)</span>
                          <span className="font-semibold text-white">{order.buyerName}</span>
                          <span className="text-slateforest-400 block text-[10px]">Dhaka B2B Wholesale Depot</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Trigger */}
                    <button
                      onClick={() => handleClaimRun(order.id)}
                      className="glass-button-primary text-xs w-full cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Truck className="w-4 h-4" />
                      Claim Transit Task & Dispatch
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ACTIVE IN-TRANSIT JOBS */}
        {activeTab === "active" && (
          activeTasks.length === 0 ? (
            <div className="glass-card p-12 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
              <Truck className="w-10 h-10 text-slateforest-600 mx-auto mb-2 animate-bounce" />
              <h4 className="text-sm font-semibold text-white">No Active Cargoes in Transit</h4>
              <p className="text-xs text-slateforest-500 max-w-sm mx-auto mt-1">
                Go to the pending tab to claim open jobs and start simulated delivery routes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map((order) => {
                const deliveryFee = Math.round(order.totalAmount * 0.08);
                const isScanningThis = scanningCode === order.id;
                
                return (
                  <div key={order.id} className="glass-card p-5 bg-slateforest-850/40 border-market-gold/30 flex flex-col gap-4">
                    <div className="flex justify-between items-start border-b border-slateforest-800 pb-3">
                      <div>
                        <span className="font-mono text-[9px] text-slateforest-500 block">{order.id}</span>
                        <h4 className="text-sm font-display font-semibold text-white capitalize">
                          {order.cropType} ({order.quantity} kg)
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slateforest-500 block">Payout on Delivery</span>
                        <span className="font-mono font-bold text-market-gold">{deliveryFee.toLocaleString()} BDT</span>
                      </div>
                    </div>

                    {/* Map Routing */}
                    <div className="bg-slateforest-950/60 rounded-xl p-3 border border-slateforest-800 text-xs flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">Feni Sadar</span>
                        <ArrowRight className="w-3.5 h-3.5 text-market-gold animate-pulse" />
                        <span className="font-semibold text-white">Dhaka Warehouse</span>
                      </div>
                      <span className="text-[10px] text-market-gold font-bold px-2 py-0.5 bg-market-gold/10 rounded animate-pulse">
                        In Transit (148 km)
                      </span>
                    </div>

                    {/* QR Code Handshake Trigger Modal inside card */}
                    {isScanningThis ? (
                      <form onSubmit={handleConfirmCodeSubmit} className="bg-slateforest-950/80 p-4 rounded-xl border border-blue-500/30 flex flex-col gap-3.5 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs">
                          <QrCode className="w-5 h-5 text-blue-400 shrink-0" />
                          <h5 className="font-bold text-white uppercase tracking-wider">
                            Merchant Delivery Handshake
                          </h5>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slateforest-400">Enter 4-Digit Delivery Code (ক্রেতার কোড)</label>
                          <input 
                            type="text"
                            maxLength={4}
                            required
                            value={typedCode}
                            onChange={(e) => setTypedCode(e.target.value)}
                            placeholder="e.g. 5432"
                            className="glass-input font-mono text-center tracking-widest text-lg py-2 focus:border-blue-500"
                          />
                          <span className="text-[9px] text-slateforest-500 block mt-1 text-center">
                            Ask the buyer for their verification PIN (found in their order dashboard)
                          </span>
                        </div>

                        {scanError && (
                          <span className="text-[10px] text-red-400 font-bold block text-center animate-bounce">
                            ⚠️ {scanError}
                          </span>
                        )}

                        <div className="flex justify-end gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setScanningCode(null)}
                            className="glass-button-secondary text-[10px] py-1.5 px-3"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="glass-button-primary bg-blue-600 hover:bg-blue-500 text-[10px] py-1.5 px-3"
                          >
                            Verify & Complete Delivery
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => handleVerifyQR(order)}
                        className="glass-button-accent bg-market-gold hover:bg-yellow-400 text-slateforest-950 text-xs w-full cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" />
                        Scan QR / Verify Handshake
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* COMPLETED RUNS */}
        {activeTab === "completed" && (
          completedTasks.length === 0 ? (
            <div className="glass-card p-12 text-center text-slateforest-500 bg-slateforest-950/20 border border-dashed border-slateforest-700/60">
              <ShieldCheck className="w-10 h-10 text-slateforest-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-white">No Completed Runs Logged</h4>
              <p className="text-xs text-slateforest-500 max-w-sm mx-auto mt-1">
                Completed runs and settled payouts will log here automatically on verified deliveries.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.map((order) => {
                const deliveryFee = Math.round(order.totalAmount * 0.08);
                
                return (
                  <div key={order.id} className="glass-card p-5 bg-slateforest-850/20 border-agri-500/20 flex flex-col gap-3 opacity-80">
                    <div className="flex justify-between items-center border-b border-slateforest-800 pb-2.5">
                      <div>
                        <span className="font-mono text-[8px] text-slateforest-500 block">{order.id}</span>
                        <h4 className="text-xs font-bold text-white capitalize">{order.cropType} Delivery</h4>
                      </div>
                      <span className="text-[10px] font-bold text-agri-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Settled: +{deliveryFee} BDT
                      </span>
                    </div>

                    {/* Ship Details */}
                    <div className="text-[10px] text-slateforest-400 flex flex-col gap-1">
                      <span>Pickup: {order.farmerName} (Feni)</span>
                      <span>Delivery: {order.buyerName} (Dhaka Hub)</span>
                      <span>Weight: {order.quantity} kg</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>
    </div>
  );
}
