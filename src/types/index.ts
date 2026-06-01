export type UserRole = "farmer" | "merchant" | "logistics" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  location: string;
  walletBalance: number;       // Farmer's direct wallet / Logistics earnings
  pendingEscrow: number;       // Money locked in the escrow pipeline
}

export type CropCategory = "rice" | "potato" | "tomato" | "onion" | "chili" | "lentil";

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropType: CropCategory;
  variety: string;
  quantity: number;            // in KG
  pricePerKg: number;          // in BDT
  totalAmount: number;         // quantity * pricePerKg
  harvestDate: string;
  location: string;            // e.g. "Feni", "Comilla"
  description: string;
  status: "available" | "escrowed" | "completed";
  recommendedPrice: number;    // Recommended fair price based on regional analytics
}

export interface EscrowOrder {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  cropType: CropCategory;
  quantity: number;
  totalAmount: number;
  paymentStatus: "pending" | "escrowed" | "released";
  deliveryStatus: "ordered" | "transit" | "delivered";
  paymentGateway: "bkash" | "nagad" | "upay" | "card" | null;
  logisticsId: string | null;
  orderDate: string;
  verificationCode: string;   // Unique QR delivery handshake code
}

export interface LogisticsTask {
  id: string;
  orderId: string;
  cropType: CropCategory;
  quantity: number;
  totalAmount: number;
  farmerName: string;
  pickupLocation: string;
  buyerName: string;
  deliveryLocation: string;
  status: "pending" | "transit" | "completed";
  deliveryFee: number;         // Logistics partner payout
}

export interface DistrictPriceHistory {
  date: string;
  price: number;
}

export interface CropMarketPrice {
  cropType: CropCategory;
  district: string;
  farmerPrice: number;        // regional farmgate price
  retailPrice: number;        // city consumer retail price
  suggestedPriceRange: { min: number; max: number };
  trend: "up" | "down" | "stable";
  history: DistrictPriceHistory[];
}

export interface DiseaseDiagnostic {
  id: string;
  cropType: string;
  diseaseName: string;
  diseaseBangla: string;
  confidence: number;
  symptoms: string;
  symptomsBangla: string;
  cause: string;
  treatmentRoadmap: string[];
  treatmentRoadmapBangla: string[];
  organicAlternatives: string[];
  organicAlternativesBangla: string[];
}
