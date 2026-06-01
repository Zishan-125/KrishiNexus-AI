import React, { useState } from "react";
import { CropCategory } from "@/types";
import { TrendingUp, Globe, MapPin, Info } from "lucide-react";

export default function PriceTrends() {
  const [selectedCrop, setSelectedCrop] = useState<CropCategory>("rice");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const cropsList: { id: CropCategory; label: string }[] = [
    { id: "rice", label: "Aman Rice (চাল)" },
    { id: "potato", label: "Diamant Potato (আলু)" },
    { id: "tomato", label: "Hybrid Tomato (টমেটো)" },
    { id: "onion", label: "Local Onion (পেঁয়াজ)" },
    { id: "chili", label: "Green Chili (কাঁচামরিচ)" }
  ];

  // Price history data points for 6 weeks across 3 districts
  const priceData: Record<CropCategory, {
    labels: string[];
    feni: number[];
    comilla: number[];
    dhaka: number[];
    suggestedMin: number;
    suggestedMax: number;
  }> = {
    rice: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [42, 45, 44, 46, 48, 52],
      comilla: [48, 51, 50, 53, 55, 59],
      dhaka: [68, 72, 70, 75, 78, 85],
      suggestedMin: 62,
      suggestedMax: 68
    },
    potato: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [22, 24, 25, 23, 27, 30],
      comilla: [28, 30, 31, 29, 34, 38],
      dhaka: [42, 45, 48, 46, 52, 58],
      suggestedMin: 40,
      suggestedMax: 44
    },
    tomato: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [35, 40, 52, 60, 48, 42],
      comilla: [45, 52, 68, 75, 60, 54],
      dhaka: [70, 85, 110, 120, 95, 82],
      suggestedMin: 65,
      suggestedMax: 72
    },
    onion: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [65, 68, 72, 85, 98, 110],
      comilla: [72, 78, 85, 96, 112, 125],
      dhaka: [90, 105, 118, 135, 150, 175],
      suggestedMin: 120,
      suggestedMax: 135
    },
    chili: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [80, 95, 120, 140, 110, 90],
      comilla: [95, 115, 140, 165, 130, 110],
      dhaka: [140, 170, 210, 240, 190, 160],
      suggestedMin: 130,
      suggestedMax: 150
    },
    lentil: {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"],
      feni: [110, 112, 115, 114, 118, 120],
      comilla: [118, 122, 125, 124, 128, 132],
      dhaka: [135, 142, 145, 146, 152, 158],
      suggestedMin: 130,
      suggestedMax: 138
    }
  };

  const current = priceData[selectedCrop];

  // SVG Chart Config
  const width = 500;
  const height = 240;
  const paddingX = 40;
  const paddingY = 30;

  // Scale functions
  const maxPrice = Math.max(...current.feni, ...current.comilla, ...current.dhaka) * 1.1;
  const minPrice = 0;

  const getX = (index: number) => {
    return paddingX + (index * (width - 2 * paddingX)) / (current.labels.length - 1);
  };

  const getY = (price: number) => {
    return height - paddingY - ((price - minPrice) * (height - 2 * paddingY)) / (maxPrice - minPrice);
  };

  // Build SVG Path strings
  const getPathD = (points: number[]) => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p)}`).join(" ");
  };

  const getAreaD = (points: number[]) => {
    const linePath = getPathD(points);
    const startX = getX(0);
    const endX = getX(points.length - 1);
    const bottomY = height - paddingY;
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full bg-slateforest-800/60">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-agri-400" />
            <h2 className="text-lg font-display font-semibold text-white tracking-wide">
              District Price Benchmarks & Trends
            </h2>
          </div>
          <p className="text-xs text-slateforest-400">
            Comparing local middlemen buying prices with capital consumer averages.
          </p>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slateforest-950/60 p-1 rounded-xl border border-slateforest-700/50">
          {cropsList.map((crop) => (
            <button
              key={crop.id}
              onClick={() => {
                setSelectedCrop(crop.id);
                setHoverIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                selectedCrop === crop.id
                  ? "bg-agri-500 text-white shadow-md shadow-agri-600/20"
                  : "text-slateforest-400 hover:text-slateforest-200"
              }`}
            >
              {crop.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-center">
        {/* SVG Graphic (Span 2) */}
        <div className="xl:col-span-2 relative bg-slateforest-950/40 rounded-xl p-4 border border-slateforest-700/30 bg-dot-grid">
          {/* Custom SVG Drawing */}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
            <defs>
              {/* Gradients */}
              <linearGradient id="grad-feni" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(142, 72%, 38%)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="hsl(142, 72%, 38%)" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="grad-comilla" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="hsl(38, 92%, 50%)" stopOpacity="0.0"/>
              </linearGradient>
              <linearGradient id="grad-dhaka" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingY + ratio * (height - 2 * paddingY);
              const gridPrice = maxPrice - ratio * maxPrice;
              return (
                <g key={i}>
                  <line 
                    x1={paddingX} 
                    y1={y} 
                    x2={width - paddingX} 
                    y2={y} 
                    className="stroke-slateforest-700/40" 
                    strokeDasharray="4,4" 
                  />
                  <text 
                    x={paddingX - 8} 
                    y={y + 4} 
                    className="fill-slateforest-500 font-mono text-[9px] text-right" 
                    textAnchor="end"
                  >
                    {Math.round(gridPrice)}
                  </text>
                </g>
              );
            })}

            {/* X-Axis labels */}
            {current.labels.map((label, i) => (
              <text 
                key={i} 
                x={getX(i)} 
                y={height - paddingY + 16} 
                className="fill-slateforest-400 text-[10px] text-center" 
                textAnchor="middle"
              >
                {label}
              </text>
            ))}

            {/* Suggested price range shadow band */}
            <rect 
              x={paddingX}
              y={getY(current.suggestedMax)}
              width={width - 2 * paddingX}
              height={getY(current.suggestedMin) - getY(current.suggestedMax)}
              className="fill-agri-500/5 stroke-none"
            />

            {/* Area Fills */}
            <path d={getAreaD(current.dhaka)} fill="url(#grad-dhaka)" />
            <path d={getAreaD(current.comilla)} fill="url(#grad-comilla)" />
            <path d={getAreaD(current.feni)} fill="url(#grad-feni)" />

            {/* Line Paths */}
            <path d={getPathD(current.dhaka)} className="stroke-blue-500 stroke-2 fill-none" />
            <path d={getPathD(current.comilla)} className="stroke-market-gold stroke-2 fill-none" />
            <path d={getPathD(current.feni)} className="stroke-agri-500 stroke-2 fill-none" />

            {/* Interactive Circles / Hover detection */}
            {current.feni.map((p, i) => {
              const x = getX(i);
              const yFeni = getY(p);
              const yComilla = getY(current.comilla[i]);
              const yDhaka = getY(current.dhaka[i]);
              const isHovered = hoverIndex === i;

              return (
                <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)} onMouseLeave={() => setHoverIndex(null)}>
                  {/* Invisible broad trigger bar */}
                  <rect 
                    x={x - 15} 
                    y={paddingY} 
                    width={30} 
                    height={height - 2 * paddingY} 
                    fill="transparent" 
                  />

                  {/* Vertical indicator bar */}
                  {isHovered && (
                    <line 
                      x1={x} 
                      y1={paddingY} 
                      x2={x} 
                      y2={height - paddingY} 
                      className="stroke-slateforest-500/60" 
                      strokeDasharray="2,2" 
                    />
                  )}

                  {/* Points */}
                  <circle cx={x} cy={yFeni} r={isHovered ? 5 : 3.5} className="fill-agri-500 stroke-slateforest-950 stroke-1" />
                  <circle cx={x} cy={yComilla} r={isHovered ? 5 : 3.5} className="fill-market-gold stroke-slateforest-950 stroke-1" />
                  <circle cx={x} cy={yDhaka} r={isHovered ? 5 : 3.5} className="fill-blue-500 stroke-slateforest-950 stroke-1" />
                </g>
              );
            })}
          </svg>

          {/* District Color Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slateforest-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-agri-500"></span>
              <span className="text-xs font-medium text-slateforest-300">Local Farmer Price (Feni)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-market-gold"></span>
              <span className="text-xs font-medium text-slateforest-300">District Hub (Comilla)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-medium text-slateforest-300">City Retail Benchmark (Dhaka)</span>
            </div>
          </div>
        </div>

        {/* Pricing Analytics Panel */}
        <div className="flex flex-col gap-4">
          {/* Main comparative callout */}
          <div className="bg-slateforest-900/60 rounded-xl p-4 border border-slateforest-700/30">
            <h3 className="text-xs font-semibold text-slateforest-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-agri-400" />
              Middlemen Arbitrage Analysis
            </h3>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-display font-extrabold text-red-400">
                +{Math.round(((current.dhaka[5] - current.feni[5]) / current.feni[5]) * 100)}%
              </span>
              <span className="text-xs text-slateforest-300 font-medium">Middlemen Spread</span>
            </div>
            <p className="text-xs text-slateforest-400 leading-relaxed">
              Traditional brokers buy from farmers in Feni at <span className="font-mono text-white font-semibold">{current.feni[5]} BDT</span> and sell in Dhaka for <span className="font-mono text-white font-semibold">{current.dhaka[5]} BDT</span>, capturing most of the value.
            </p>
          </div>

          {/* Suggested Price Engine */}
          <div className="bg-gradient-to-br from-agri-500/10 to-emerald-500/0 rounded-xl p-4 border border-agri-500/20">
            <h3 className="text-xs font-bold text-agri-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 animate-pulse" />
              KrishiNexus Suggested Price
            </h3>
            
            <div className="text-xl font-display font-bold text-white mb-2">
              <span className="font-mono text-agri-300">{current.suggestedMin} - {current.suggestedMax}</span> BDT/Kg
            </div>
            <p className="text-[11px] text-slateforest-400 leading-relaxed">
              Direct-to-market pricing allows you to list crops in this range. Farmers earn <span className="text-agri-400 font-semibold">+35% more</span>, and restaurant/retail buyers save <span className="text-blue-400 font-semibold">25%</span> compared to city retail index.
            </p>
          </div>

          {/* Selected Data Point (Hover or Latest) */}
          <div className="bg-slateforest-900/40 rounded-xl p-3 border border-slateforest-700/20 text-xs">
            <div className="flex justify-between items-center text-slateforest-400 font-semibold mb-1">
              <span>Selected Point:</span>
              <span className="text-white">{hoverIndex !== null ? `Week ${hoverIndex + 1}` : "Latest (Week 6)"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-2">
              <div className="bg-slateforest-950/40 p-2 rounded-lg border border-slateforest-800">
                <span className="text-[10px] text-slateforest-500 block">Feni</span>
                <span className="font-mono font-bold text-agri-400 text-sm">
                  {hoverIndex !== null ? current.feni[hoverIndex] : current.feni[5]} BDT
                </span>
              </div>
              <div className="bg-slateforest-950/40 p-2 rounded-lg border border-slateforest-800">
                <span className="text-[10px] text-slateforest-500 block">Comilla</span>
                <span className="font-mono font-bold text-market-gold text-sm">
                  {hoverIndex !== null ? current.comilla[hoverIndex] : current.comilla[5]} BDT
                </span>
              </div>
              <div className="bg-slateforest-950/40 p-2 rounded-lg border border-slateforest-800">
                <span className="text-[10px] text-slateforest-500 block">Dhaka</span>
                <span className="font-mono font-bold text-blue-400 text-sm">
                  {hoverIndex !== null ? current.dhaka[hoverIndex] : current.dhaka[5]} BDT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
