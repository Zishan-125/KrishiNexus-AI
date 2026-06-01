# KrishiNexus AI 🌾
> **The Intelligent Agritech Supply Chain & Yield Optimization Hub**

KrishiNexus AI is an enterprise-grade B2B2C agricultural ecosystem designed to eliminate two massive real-world pain points:
1. **The Diagnostic & Yield Gap (AI Crop Doctor):** Unlocking immediate, accessible crop health assessments and organic/chemical remedies in local districts like Feni.
2. **The Exploitative Supply Chain (Direct-to-Market B2B Platform):** Bypassing layers of middlemen, allowing farmers to sell direct to wholesale buyers (restaurants, supermarkets) and securing transactions through automated multi-signature escrows.

---

## 🛠️ Industry-Grade Tech Stack

- **Frontend Core:** [Next.js 15 (TypeScript)](https://nextjs.org/) utilizing the App Router.
- **Styling & UI:** [Tailwind CSS v3](https://tailwindcss.com/) with a custom HSL palette (agri emeralds, slate forests, market golds), glassmorphic layout tokens, and custom keyframe animations.
- **Iconography:** [Lucide React](https://lucide.dev/) for vector iconography.
- **AI Accessibility:** [Web Speech API (SpeechSynthesis)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) for localized Bangla Text-to-Speech audio playbacks.
- **Database Schema & Relational Models:** Structured TypeScript schemas matching user accounts, listings, escrow orders, and logistics runs.

---

## 🏗️ Folder Structure

```
d:\Hackathon\
├── package.json               # Dependencies (Next.js 15, React 19, Lucide, Tailwind)
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Customized agritech theme HSL & animations
├── postcss.config.js          # Tailwind compilation rules
├── next.config.ts             # Next.js configurations
├── README.md                  # Developer & Presentation Guide
└── src/
    ├── types/
    │   └── index.ts           # Unified schemas for Crops, Orders, and Diagnostics
    ├── app/
    │   ├── layout.tsx         # Layout with Outfit + Inter fonts and SEO tags
    │   ├── page.tsx           # Global State Coordinator & Dashboard views
    │   ├── globals.css        # Glassmorphic classes, neon scrollbars, scanner keyframes
    │   └── api/
    │       ├── diagnose/
    │       │   └── route.ts   # API handler returning disease diagnostics & treatment roadmaps
    │       └── escrow/
    │           └── route.ts   # API handler mimicking SSLCommerz lock & releases
    └── components/
        ├── CropDoctor.tsx     # Animated leaf scan + Web Speech Bangla Voice reader
        ├── FarmerPortal.tsx   # Harvest listing + AI price recommendations + Wallet balances
        ├── Marketplace.tsx    # B2B buyer catalog + Categories + Checkout modal
        ├── LogisticsHub.tsx   # Driver runs + Route maps + QR verification release code
        ├── PriceTrends.tsx    # Responsive gradient SVG price lines (Feni vs. Dhaka)
        ├── PaymentGateway.tsx # SSLCommerz checkout sandbox (bKash, Nagad, Card)
        └── Sidebar.tsx        # Brand layout + User persona switcher + Telemetry details
```

---

## 🚀 How to Run the Project Locally

Since the local terminal environment in this sandboxed session has a broken PowerShell `.NET InitialSessionState` conflict, we have written the entire clean Next.js 15 TypeScript project files directly into your workspace. 

You can run this project instantly in your own terminal (where there are no shell conflicts) by following these 3 simple steps:

1. **Open your Terminal:** Navigate to the folder `d:\Hackathon` in your preferred CLI (VS Code Terminal, Git Bash, Command Prompt, or terminal emulator).
2. **Install Dependencies:** Run the following command to download all required packages:
   ```bash
   npm install
   ```
3. **Start the Dev Server:** Launch the Next.js local server:
   ```bash
   npm run dev
   ```
4. **Explore the Application:** Open your web browser and go to:
   **`http://localhost:3000`**

---

## 🌟 Interactive Journeys to Demo

Toggle through the sidebar drawer to experience the complete B2B direct supply chain loop:

### 1. AI Crop Doctor (Yield Diagnostics)
- **Action:** In the Farmer/Merchant/Driver portal, locate the **AI Crop Doctor** centerpiece.
- **Diagnostic Scan:** Click one of the preloaded diseased leaves (e.g. Potato Late Blight, Rice Blast) and press **Scan & Diagnose**.
- **Visual Scan:** Watch the 3-second animated green laser scanner sweep across the crop leaf, displaying bounding box tags outlining infected coordinates.
- **Audio Feedback:** Press the glowing **Play Voice** button. The application leverages native speech synthesis to read the disease symptoms and treatment roadmap in clear, localized Bengali for semi-literate growers.

### 2. direct B2B Yield Listings (Farmer Portal)
- **Action:** Open the **Farmer Portal** view. Check your live and locked escrow wallet telemetry.
- **Harvest Lister:** Click **List New Harvest**. Select crop (e.g., Aman Rice) and fill out the variety details.
- **AI Pricing Recommendations:** Press **Get AI Price**. The pricing engine reviews regional district databases and automatically injects a recommended B2B rate (e.g. 65 BDT/kg instead of letting brokers undercut at 42 BDT/kg). Press **Publish Listing**.

### 3. SSLCommerz Escrow Sandbox (Merchant Hub)
- **Action:** Switch to the **Merchant Hub** workspace. Search for your newly listed crop.
- **Direct Buying:** Select the crop card and click **Buy Direct**. Review shipping distances and prices (including 8% delivery fees).
- **Checkout Modal:** The sandbox SSLCommerz overlay renders. Select **bKash** or **Nagad**. Fill out your mobile number, enter a 6-digit mock OTP, input your pin, and press verify. 
- **Escrow Lock:** The system securely locks the payment in the escrow pipeline, notifying the farmer and dispatching a logistics request.

### 4. QR Handshake Webhook (Logistics Partner)
- **Action:** Toggle to the **Logistics Partner** portal. View claimed and pending cargo deliveries.
- **Claim Cargo:** Select the new order from Feni and click **Claim Task & Dispatch**. Observe the dynamic "In Transit" route indicator tracking the 148 km haul.
- **Escrow Settlement:** Click **Scan QR / Verify Handshake**. Input the merchant's secret 4-digit code (visible on the farmer's order timeline, e.g. 5432).
- **Webhook Dispatch:** The system fires the escrow release request, instantly crediting the farmer's live wallet balance and settles the delivery fee directly into the driver's logistics wallet!
