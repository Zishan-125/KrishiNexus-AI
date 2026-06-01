import React, { useState } from "react";
import { CropListing } from "@/types";
import { X, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

interface PaymentGatewayProps {
  listing: CropListing;
  onClose: () => void;
  onSuccess: (method: "bkash" | "nagad" | "upay" | "card") => void;
}

type Step = "select" | "number" | "otp" | "pin" | "loading" | "success";
type Method = "bkash" | "nagad" | "upay" | "card";

export default function PaymentGateway({ listing, onClose, onSuccess }: PaymentGatewayProps) {
  const [method, setMethod] = useState<Method>("bkash");
  const [step, setStep] = useState<Step>("select");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const logisticsFee = Math.round(listing.totalAmount * 0.08); // 8% logistics fee
  const grandTotal = listing.totalAmount + logisticsFee;

  const handleNextStep = () => {
    if (step === "select") {
      if (method === "card") {
        setStep("number"); // For card, number means card details
      } else {
        setStep("number"); // For MFS, number means wallet number
      }
    } else if (step === "number") {
      setStep("otp");
    } else if (step === "otp") {
      setStep("pin");
    } else if (step === "pin") {
      setStep("loading");
      setTimeout(() => {
        setStep("success");
      }, 2500);
    }
  };

  const handlePaymentComplete = () => {
    onSuccess(method);
  };

  return (
    <div className="fixed inset-0 bg-slateforest-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-card overflow-hidden bg-slateforest-900 border-slateforest-700/80 shadow-2xl relative">
        
        {/* Header */}
        <div className="p-5 border-b border-slateforest-800 flex justify-between items-center bg-slateforest-950/40">
          <div>
            <span className="text-[10px] text-agri-400 font-extrabold uppercase tracking-widest block mb-0.5">
              SSLCommerz Secure Escrow Sandbox
            </span>
            <h2 className="text-base font-display font-semibold text-white tracking-wide">
              Direct-to-Market Checkout
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slateforest-400 hover:bg-slateforest-800 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary banner */}
        <div className="p-4 bg-slateforest-950/70 border-b border-slateforest-800 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slateforest-500 block">Item Purchased:</span>
            <span className="font-semibold text-white capitalize">{listing.cropType} ({listing.variety})</span>
          </div>
          <div>
            <span className="text-slateforest-500 block">Farmer / Origin:</span>
            <span className="font-semibold text-white">{listing.farmerName} ({listing.location})</span>
          </div>
          <div>
            <span className="text-slateforest-500 block">Quantity & Pricing:</span>
            <span className="font-semibold text-white">{listing.quantity} kg @ {listing.pricePerKg} BDT</span>
          </div>
          <div>
            <span className="text-slateforest-500 block">Total Due (incl. 8% Delivery):</span>
            <span className="font-bold text-agri-400 font-mono text-sm">{grandTotal.toLocaleString()} BDT</span>
          </div>
        </div>

        {/* Dynamic Interface based on step */}
        <div className="p-6">
          
          {/* STEP 1: Select Payment Gateway */}
          {step === "select" && (
            <div className="flex flex-col gap-5 animate-fade-in-up">
              <span className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider block">
                Select Wallet or Payment Channel
              </span>
              
              <div className="grid grid-cols-2 gap-3">
                {/* bKash */}
                <button
                  onClick={() => setMethod("bkash")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                    method === "bkash"
                      ? "border-[#D12053] bg-[#D12053]/5 text-white"
                      : "border-slateforest-700 bg-slateforest-800/30 text-slateforest-300 hover:border-slateforest-500"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center font-bold text-white bg-[#D12053] rounded-xl text-lg shadow-md shadow-[#D12053]/20">
                    b
                  </div>
                  <span className="text-xs font-bold tracking-wide">bKash Wallet</span>
                </button>

                {/* Nagad */}
                <button
                  onClick={() => setMethod("nagad")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                    method === "nagad"
                      ? "border-[#F45826] bg-[#F45826]/5 text-white"
                      : "border-slateforest-700 bg-slateforest-800/30 text-slateforest-300 hover:border-slateforest-500"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center font-bold text-white bg-[#F45826] rounded-xl text-lg shadow-md shadow-[#F45826]/20">
                    n
                  </div>
                  <span className="text-xs font-bold tracking-wide">Nagad Wallet</span>
                </button>

                {/* Upay */}
                <button
                  onClick={() => setMethod("upay")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                    method === "upay"
                      ? "border-[#1F419B] bg-[#1F419B]/5 text-white"
                      : "border-slateforest-700 bg-slateforest-800/30 text-slateforest-300 hover:border-slateforest-500"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center font-bold text-[#FCD116] bg-[#1F419B] rounded-xl text-lg shadow-md shadow-[#1F419B]/20">
                    u
                  </div>
                  <span className="text-xs font-bold tracking-wide">Upay Wallet</span>
                </button>

                {/* Cards */}
                <button
                  onClick={() => setMethod("card")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
                    method === "card"
                      ? "border-blue-500 bg-blue-500/5 text-white"
                      : "border-slateforest-700 bg-slateforest-800/30 text-slateforest-300 hover:border-slateforest-500"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center text-white bg-blue-500 rounded-xl shadow-md shadow-blue-500/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold tracking-wide">Card (SSL)</span>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slateforest-400 bg-slateforest-950/30 p-3 rounded-lg border border-slateforest-800">
                <ShieldCheck className="w-5 h-5 text-agri-400 shrink-0" />
                <span>Your checkout is protected by a secure Multi-signature Escrow. Funds are only released to the farmer upon verified logistics delivery.</span>
              </div>
            </div>
          )}

          {/* STEP 2: Enter Number or Card Details */}
          {step === "number" && (
            <div className="flex flex-col gap-4 animate-fade-in-up">
              {method !== "card" ? (
                <>
                  <div className="flex items-center justify-center mb-2">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold text-white capitalize ${
                      method === "bkash" ? "bg-[#D12053]" : method === "nagad" ? "bg-[#F45826]" : "bg-[#1F419B]"
                    }`}>
                      {method} payment portal
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slateforest-400">
                      Enter Mobile Account Number (বিকাশ/নগদ/উপায় নম্বর)
                    </label>
                    <input 
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 017XXXXXXXX"
                      className="glass-input text-lg font-mono text-center tracking-wider"
                    />
                    <span className="text-[10px] text-slateforest-500 text-center">
                      By proceeding you agree to SSLCommerz Terms & Conditions
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-semibold text-slateforest-400 mb-1">
                    Enter Secure Card Credentials
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slateforest-400 font-semibold uppercase">Cardholder Name</label>
                    <input 
                      type="text" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. Foysal Ahmed" 
                      className="glass-input" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slateforest-400 font-semibold uppercase">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4321 8765 4321 0987" 
                      className="glass-input font-mono" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slateforest-400 font-semibold uppercase">Expiry Date</label>
                      <input 
                        type="text" 
                        value={cardExpiry} 
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY" 
                        className="glass-input font-mono text-center" 
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] text-slateforest-400 font-semibold uppercase">CVC Code</label>
                      <input 
                        type="password" 
                        value={cardCvc} 
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="***" 
                        className="glass-input font-mono text-center" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: OTP Verification */}
          {step === "otp" && (
            <div className="flex flex-col gap-4 items-center text-center animate-fade-in-up">
              <span className="px-4 py-2 bg-slateforest-950 rounded-xl text-xs font-semibold text-slateforest-300">
                OTP verification code sent to {phoneNumber || "your device"}
              </span>

              <div className="flex flex-col gap-2 w-full mt-2">
                <label className="text-xs font-semibold text-slateforest-400">
                  Enter 6-Digit OTP Code (ওটিপি কোড)
                </label>
                <input 
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="X X X - X X X"
                  className="glass-input text-2xl font-mono text-center tracking-widest font-bold"
                />
                <div className="flex justify-between items-center text-[10px] text-slateforest-500 mt-1">
                  <span>Didn't receive code?</span>
                  <button className="text-agri-400 hover:text-agri-300 font-semibold cursor-pointer">
                    Resend SMS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Transaction PIN */}
          {step === "pin" && (
            <div className="flex flex-col gap-4 items-center text-center animate-fade-in-up">
              <span className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white capitalize ${
                method === "bkash" ? "bg-[#D12053]" : method === "nagad" ? "bg-[#F45826]" : "bg-[#1F419B]"
              }`}>
                Enter Secure Account PIN
              </span>

              <div className="flex flex-col gap-2 w-full mt-2">
                <label className="text-xs font-semibold text-slateforest-400">
                  Input 4 or 5 Digit Account Wallet PIN (পিন নম্বর)
                </label>
                <input 
                  type="password"
                  maxLength={5}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="• • • • •"
                  className="glass-input text-2xl text-center tracking-widest"
                />
                <span className="text-[10px] text-slateforest-500 flex items-center justify-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
                  Your PIN is fully encrypted on local client session.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Loading state */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <div className="w-16 h-16 rounded-full border-4 border-slateforest-800 border-t-agri-500 animate-spin"></div>
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-1">
                  Validating Escrow Contract
                </h3>
                <p className="text-xs text-slateforest-400">
                  Locking BDT {grandTotal.toLocaleString()} into SSL secure escrow wallet...
                </p>
              </div>
            </div>
          )}

          {/* STEP 6: Success Splash */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center animate-fade-in-up">
              <div className="p-4 bg-agri-500/20 border border-agri-500/40 rounded-full text-agri-400 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white mb-1">
                  Payment Locked in Escrow!
                </h3>
                <span className="font-mono text-xs text-slateforest-400 bg-slateforest-950 px-3 py-1 rounded-md border border-slateforest-800">
                  TXN: SSL_ESC_{Math.floor(100000 + Math.random() * 900000)}
                </span>
                <p className="text-xs text-slateforest-400 leading-relaxed mt-3 max-w-sm">
                  The payment has been securely escrowed. A regional logistics partner has been auto-notified to pick up the harvest from <span className="font-semibold text-white">{listing.farmerName} ({listing.location})</span>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slateforest-800 bg-slateforest-950/40 flex justify-between items-center">
          {step === "select" ? (
            <>
              <button 
                onClick={onClose}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleNextStep}
                className="glass-button-primary text-xs"
              >
                Proceed to Pay
              </button>
            </>
          ) : step === "success" ? (
            <button 
              onClick={handlePaymentComplete}
              className="glass-button-primary w-full text-xs"
            >
              Back to Marketplace
            </button>
          ) : step !== "loading" ? (
            <>
              <button 
                onClick={() => {
                  if (step === "number") setStep("select");
                  else if (step === "otp") setStep("number");
                  else if (step === "pin") setStep("otp");
                }}
                className="glass-button-secondary text-xs"
              >
                Back
              </button>
              <button 
                onClick={handleNextStep}
                className="glass-button-primary text-xs"
                disabled={
                  (step === "number" && method !== "card" && phoneNumber.length < 11) ||
                  (step === "number" && method === "card" && !cardNumber) ||
                  (step === "otp" && otp.length < 4) ||
                  (step === "pin" && pin.length < 4)
                }
              >
                Verify Code
              </button>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
