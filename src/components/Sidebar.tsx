import React from "react";
import { UserRole } from "@/types";
import { 
  Sprout, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  Activity, 
  Globe, 
  ShieldAlert 
} from "lucide-react";

interface SidebarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  farmerBalance: number;
  farmerPending: number;
  logisticsBalance: number;
}

export default function Sidebar({ 
  activeRole, 
  onRoleChange, 
  farmerBalance, 
  farmerPending,
  logisticsBalance 
}: SidebarProps) {
  
  const roles = [
    { 
      id: "farmer" as UserRole, 
      label: "Farmer Portal", 
      desc: "List harvests, track crop health",
      icon: Sprout, 
      color: "text-agri-400 group-hover:text-agri-300",
      activeBg: "bg-agri-500/10 text-agri-400 border-agri-500/30"
    },
    { 
      id: "merchant" as UserRole, 
      label: "Merchant Hub", 
      desc: "Purchase direct, verify escrow",
      icon: ShoppingBag, 
      color: "text-market-gold group-hover:text-amber-300",
      activeBg: "bg-market-gold/10 text-market-gold border-market-gold/30"
    },
    { 
      id: "logistics" as UserRole, 
      label: "Logistics Partner", 
      desc: "Claim runs, confirm deliveries",
      icon: Truck, 
      color: "text-blue-400 group-hover:text-blue-300",
      activeBg: "bg-blue-500/10 text-blue-400 border-blue-500/30"
    },
    { 
      id: "admin" as UserRole, 
      label: "Market Insights", 
      desc: "Regional price benchmarks",
      icon: TrendingUp, 
      color: "text-purple-400 group-hover:text-purple-300",
      activeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30"
    }
  ];

  return (
    <aside className="w-full lg:w-80 flex flex-col shrink-0 glass-card bg-slateforest-800/80 p-6 border-r border-slateforest-700/50">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-agri-500 to-emerald-600 rounded-2xl shadow-lg shadow-agri-500/20 ring-1 ring-white/10 animate-pulse-glow">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-display font-extrabold text-white tracking-wide flex items-center gap-1">
            KrishiNexus <span className="text-agri-400">AI</span>
          </h1>
          <p className="text-[10px] text-slateforest-400 uppercase tracking-widest font-semibold font-sans">
            Supply & Yield Optimizer
          </p>
        </div>
      </div>

      {/* Role Selection Label */}
      <div className="mb-4">
        <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider">
          Active Workspace
        </span>
      </div>

      {/* Role Switcher Grid */}
      <div className="flex flex-col gap-3 mb-8">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`group flex items-start gap-4 p-4 rounded-xl text-left border border-transparent transition-all duration-200 cursor-pointer ${
                isActive 
                  ? role.activeBg + " shadow-lg shadow-black/5" 
                  : "bg-slateforest-900/30 text-slateforest-300 hover:bg-slateforest-700/40 hover:text-white"
              }`}
            >
              <div className={`p-2 rounded-lg bg-slateforest-900/50 border border-slateforest-700/60 ${isActive ? "border-current" : ""}`}>
                <Icon className={`w-5 h-5 ${role.color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">
                  {role.label}
                </h3>
                <p className="text-xs text-slateforest-400 group-hover:text-slateforest-300 mt-0.5">
                  {role.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Role Status Telemetry */}
      <div className="mt-auto pt-6 border-t border-slateforest-700/50 flex flex-col gap-4">
        <div className="bg-slateforest-900/60 rounded-xl p-4 border border-slateforest-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-agri-400" />
            <span className="text-xs font-bold text-slateforest-300 uppercase tracking-wider">
              Live Wallet Balances
            </span>
          </div>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slateforest-400">Farmer Balance:</span>
              <span className="font-mono font-bold text-agri-400">{farmerBalance.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slateforest-400">Farmer Escrowed:</span>
              <span className="font-mono font-bold text-market-gold">{farmerPending.toLocaleString()} BDT</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slateforest-400">Logistics Earnings:</span>
              <span className="font-mono font-bold text-blue-400">{logisticsBalance.toLocaleString()} BDT</span>
            </div>
          </div>
        </div>

        {/* Global Telemetry Info */}
        <div className="flex items-center justify-between text-[11px] text-slateforest-500">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-agri-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Feni District Node</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-agri-500 rounded-full animate-pulse"></span>
            <span>SSL Escrow Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
