import React, { useState } from "react";
import { UserRole } from "@/types";
import { 
  Sprout, 
  Phone, 
  Mail, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  UserCheck, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

interface AuthPortalProps {
  onLogin: (role: UserRole, name: string, emailOrPhone: string) => void;
}

type Tab = "farmer" | "business";

export default function AuthPortal({ onLogin }: AuthPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("farmer");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (activeTab === "farmer") {
        onLogin("farmer", "Abul Kalam", phone || "01712345678");
      } else {
        // Mock role routing based on email
        if (email.includes("logistics") || email.includes("driver")) {
          onLogin("logistics", "Feni Driver Express", email);
        } else if (email.includes("admin") || email.includes("insights")) {
          onLogin("admin", "Admin Analytics Terminal", email);
        } else {
          onLogin("merchant", "Shwapno Supermarket Corp", email || "merchant@shwapno.com");
        }
      }
    }, 1200);
  };

  // Immediate presentation/demo profiles bypass login
  const handleQuickLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "farmer") {
        onLogin("farmer", "Abul Kalam", "01712345678");
      } else if (role === "merchant") {
        onLogin("merchant", "Shwapno Supermarket Corp", "merchant@shwapno.com");
      } else if (role === "logistics") {
        onLogin("logistics", "Feni Driver Express", "driver@nexuslogistics.com");
      } else if (role === "admin") {
        onLogin("admin", "Admin Analytics Terminal", "admin@krishinexus.ai");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slateforest-900 bg-dot-grid flex items-center justify-center p-4 md:p-6 select-none animate-fade-in-up">
      <div className="w-full max-w-5xl aspect-auto lg:aspect-[16/9] glass-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl shadow-black/40 border-slateforest-700/80">
        
        {/* LEFT COLUMN: HERO PANEL & TELEMETRY LOGS (Col 5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-agri-950 via-agri-900 to-slateforest-950 p-8 flex flex-col relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slateforest-700/50">
          
          {/* Radial visual glows */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none z-0"></div>

          {/* Logo Header */}
          <div className="flex items-center gap-3 z-10 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-agri-500 to-emerald-600 rounded-xl shadow-md shadow-agri-500/20 ring-1 ring-white/10 animate-pulse-glow">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-extrabold text-white tracking-wide flex items-center gap-1">
                KrishiNexus <span className="text-agri-400">AI</span>
              </h1>
              <p className="text-[9px] text-slateforest-400 uppercase tracking-widest font-semibold">
                Agritech Supply & Yield Hub
              </p>
            </div>
          </div>

          {/* Marketing pitch */}
          <div className="z-10 my-auto flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
              Bridging the gap between <span className="text-agri-400">Yield</span> and <span className="text-market-gold">Direct B2B Market</span>.
            </h2>
            <p className="text-xs text-slateforest-400 leading-relaxed max-w-sm">
              Providing regional farmers with automated direct escrows, crop diagnostic tools, and AI price-trend suggestions.
            </p>
          </div>

          {/* Telemetry Panel */}
          <div className="mt-auto pt-6 border-t border-slateforest-800/80 flex flex-col gap-4 z-10">
            <div className="bg-slateforest-900/50 rounded-xl p-4 border border-slateforest-800/40 backdrop-blur-md">
              <div className="flex items-center justify-between text-[10px] text-slateforest-400 font-bold uppercase tracking-wider mb-2.5">
                <span>Feni Node Telemetry</span>
                <span className="flex items-center gap-1 text-agri-400">
                  <span className="w-1.5 h-1.5 bg-agri-400 rounded-full animate-ping"></span>
                  Active
                </span>
              </div>
              
              <div className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between items-center text-slateforest-400">
                  <span>Direct Trades Settled:</span>
                  <span className="text-white font-bold">12,480 BDT</span>
                </div>
                <div className="flex justify-between items-center text-slateforest-400">
                  <span>Active escrows:</span>
                  <span className="text-market-gold font-bold">SSL Secure</span>
                </div>
                <div className="flex justify-between items-center text-slateforest-400">
                  <span>Network nodes:</span>
                  <span className="text-blue-400 font-bold">128 online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slateforest-500 font-medium">
              <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-agri-500" /> Feni Sadar Local Node</span>
              <span>v1.2.0 (Next.js)</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AUTHENTICATION FORM PORTAL (Col 7) */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col bg-slateforest-950/40 relative">
          
          {/* TAB SWITCHER */}
          <div className="flex bg-slateforest-950 p-1 rounded-xl border border-slateforest-800/60 mb-8 self-start">
            <button
              onClick={() => setActiveTab("farmer")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "farmer"
                  ? "bg-agri-500 text-white shadow-lg shadow-agri-600/20"
                  : "text-slateforest-400 hover:text-white"
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Farmer Mobile Login
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                activeTab === "business"
                  ? "bg-agri-500 text-white shadow-lg shadow-agri-600/20"
                  : "text-slateforest-400 hover:text-white"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Business / Driver Login
            </button>
          </div>

          {/* DYNAMIC FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 my-auto animate-fade-in-up">
            <div>
              <h3 className="text-xl font-display font-bold text-white tracking-wide">
                Welcome back
              </h3>
              <p className="text-xs text-slateforest-400 mt-1">
                {activeTab === "farmer" 
                  ? "Log in using your registered agritech mobile account and pin."
                  : "Sign in using your corporate buyer or delivery logistics partner email."}
              </p>
            </div>

            {/* Farmer Form (Phone/PIN) */}
            {activeTab === "farmer" ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Mobile Wallet Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="glass-input pl-11 text-sm font-mono tracking-wider h-12"
                    />
                    <Phone className="w-4 h-4 text-slateforest-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Account PIN (পিন কোড)</label>
                  <div className="relative">
                    <input
                      type="password"
                      maxLength={5}
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="• • • • •"
                      className="glass-input pl-11 text-sm font-mono tracking-widest h-12"
                    />
                    <Lock className="w-4 h-4 text-slateforest-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            ) : (
              /* Business/Driver Form (Email/Password) */
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. buyer@shwapno.com / driver@nexus.com"
                      className="glass-input pl-11 text-sm h-12"
                    />
                    <Mail className="w-4 h-4 text-slateforest-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slateforest-400">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="glass-input pl-11 text-sm h-12"
                    />
                    <Lock className="w-4 h-4 text-slateforest-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="glass-button-primary w-full text-xs font-bold py-3.5 uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Verifying Account...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4.5 h-4.5" />
                  Authenticate Wallet & Enter
                </>
              )}
            </button>
          </form>

          {/* QUICK-ACCESS PRESENTATION DEMO PANEL */}
          <div className="mt-8 pt-6 border-t border-slateforest-800 flex flex-col gap-3.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-market-gold animate-pulse" />
              <span className="text-[10px] font-bold text-slateforest-400 uppercase tracking-widest">
                Quick-Access Demo Profiles (হ্যাকথোন ডেমো)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {/* Farmer Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("farmer")}
                className="px-2.5 py-2 rounded-xl bg-agri-500/10 border border-agri-500/20 text-agri-400 hover:bg-agri-500/20 hover:text-white text-[10px] font-extrabold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>🌾 Farmer Abul</span>
              </button>

              {/* Merchant Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("merchant")}
                className="px-2.5 py-2 rounded-xl bg-market-gold/10 border border-market-gold/20 text-market-gold hover:bg-market-gold/20 hover:text-white text-[10px] font-extrabold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>🏬 Merchant Shwapno</span>
              </button>

              {/* Logistics Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("logistics")}
                className="px-2.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:text-white text-[10px] font-extrabold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>🚚 Logistics Driver</span>
              </button>

              {/* Admin Demo */}
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="px-2.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-white text-[10px] font-extrabold flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span>📈 Market Insights</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
