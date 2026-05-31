import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Sparkles,
  Heart,
  Share2,
  Check,
  Briefcase,
  AlertCircle,
  Printer,
  ArrowLeft,
  ChevronRight,
  Info,
  Utensils,
  Palmtree,
  Moon,
  ShoppingBag,
  Trees,
  Bus,
  Activity,
  X,
  Flame,
  RefreshCw,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Sunset,
  Thermometer,
  Droplets,
  Wind,
  Settings,
  Search,
  Plus,
  Trash2,
  Edit,
  Globe,
  Languages,
  Cpu,
  Coins
} from "lucide-react";
import { TravelPlanResponse, TravelPlannerInputs, UserPreferences, ManagedDestination } from "./types";
import { TRAVEL_PRESETS, TravelPreset } from "./presets";
import { getSimulatedWeather, WeatherForecast } from "./weatherSim";
import { getLiveExchangeRate, getTrafficStatus, getRealtimeEvents } from "./services/travelService";

// Default seed destinations for Configurable Destination Management Hub
const DEFAULT_MANAGED_DESTINATIONS: ManagedDestination[] = [
  {
    id: "dest_1",
    name: "Paris Royale & Cultural Seine",
    city: "Paris",
    country: "France",
    timezone: "CET",
    currencyCode: "EUR",
    currencySymbol: "€",
    lat: 48.8566,
    lng: 2.3522,
    tags: ["Culture", "Art", "Romantic"],
    description: "Grand boulevards, historic museums (Louvre/d'Orsay), croissant bakeries, and Eiffel picnics."
  },
  {
    id: "dest_2",
    name: "London Imperial & Heritage Trails",
    city: "London",
    country: "United Kingdom",
    timezone: "GMT/BST",
    currencyCode: "GBP",
    currencySymbol: "£",
    lat: 51.5074,
    lng: -0.1278,
    tags: ["Royals", "History", "River Thames"],
    description: "Classic royal palaces, historic red double-decker bus trips, and Afternoon High Tea walks."
  },
  {
    id: "dest_3",
    name: "Rajasthan Rajput Heritage",
    city: "Jaipur",
    country: "India",
    timezone: "IST",
    currencyCode: "INR",
    currencySymbol: "₹",
    lat: 26.9124,
    lng: 75.7873,
    tags: ["Palaces", "Spices", "Handicrafts"],
    description: "Symmetric pink sand Haveli properties, Jaipur blue clay pottery, Taj Mahal routes, and spiced foods."
  },
  {
    id: "dest_4",
    name: "Amalfi Leisure Coastline",
    city: "Positano",
    country: "Italy",
    timezone: "CET",
    currencyCode: "EUR",
    currencySymbol: "€",
    lat: 40.6331,
    lng: 14.6027,
    tags: ["Coastline", "Yachts", "Scenic"],
    description: "Cliffside pastel estates cascading down into deep turquoise Mediterranean ports."
  },
  {
    id: "dest_5",
    name: "Dubai Horizon Skyline",
    city: "Dubai",
    country: "United Arab Emirates",
    timezone: "GST",
    currencyCode: "AED",
    currencySymbol: "د.إ",
    lat: 25.2048,
    lng: 55.2708,
    tags: ["Skyscrapers", "Dunes", "Modern"],
    description: "Spectacular dynamic architecture, desert resort safari campfires, and gold souk markets."
  },
  {
    id: "dest_6",
    name: "Singapore Garden Metropolis",
    city: "Singapore",
    country: "Singapore",
    timezone: "SGT",
    currencyCode: "SGD",
    currencySymbol: "S$",
    lat: 1.3521,
    lng: 103.8198,
    tags: ["Eco-friendly", "Foodie", "Modern"],
    description: "Lush botanical super-trees, spectacular rooftop skylines, and world-class street hawker food."
  }
];

export default function App() {
  // Navigation & Plan States
  const [inputs, setInputs] = useState<TravelPlannerInputs>({
    destination: "",
    budget: 1500,
    days: 5,
    travelStyle: "Cultural",
    constraints: "",
    preferredCurrency: "USD"
  });

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<{ type: string; message: string } | null>(null);
  const [plan, setPlan] = useState<TravelPlanResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "budget" | "concierge" | "architecture">("itinerary");
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Dynamic Modeler State (Scales total cost of the trip)
  const [adjustedBudget, setAdjustedBudget] = useState<number>(1500);

  // Interaction States
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [checkedPacking, setCheckedPacking] = useState<Record<string, boolean>>({});
  const [shareSuccess, setShareSuccess] = useState(false);

  // Weather Simulation States
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  // User Preferences State (persisted inside localStorage)
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem("travelgenie_prefs");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      homeCountry: "United States",
      baseCurrency: "USD",
      language: "English",
      timezone: "GMT/UTC"
    };
  });
  const [isPrefOpen, setIsPrefOpen] = useState(false);

  // Managed Destinations State (persisted inside localStorage)
  const [destinationsList, setDestinationsList] = useState<ManagedDestination[]>(() => {
    const saved = localStorage.getItem("travelgenie_destinations");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_MANAGED_DESTINATIONS;
  });
  
  // Destination Manager Panel and creation form states
  const [isDestManagerOpen, setIsDestManagerOpen] = useState(false);
  const [destSearchQuery, setDestSearchQuery] = useState("");
  const [isAddingCustomDest, setIsAddingCustomDest] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);
  const [newDestForm, setNewDestForm] = useState<Omit<ManagedDestination, "id">>({
    name: "",
    city: "",
    country: "",
    timezone: "CET",
    currencyCode: "EUR",
    currencySymbol: "€",
    lat: 48.8,
    lng: 2.3,
    tags: ["Culture"],
    description: ""
  });

  // Services Architect Sandbox Diagnostics States
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [liveTrafficStatus, setLiveTrafficStatus] = useState<string | null>(null);
  const [liveEventsList, setLiveEventsList] = useState<any[]>([]);
  const [diagnosticsLoading, setDiagnosticsLoading] = useState(false);

  // Save preferences to localStorage upon change
  useEffect(() => {
    localStorage.setItem("travelgenie_prefs", JSON.stringify(preferences));
  }, [preferences]);

  // Save destinations to localStorage upon change
  useEffect(() => {
    localStorage.setItem("travelgenie_destinations", JSON.stringify(destinationsList));
  }, [destinationsList]);

  // Sync Preferred Currency with User Base Currency initially or upon preference updates
  useEffect(() => {
    setInputs(prev => ({ ...prev, preferredCurrency: preferences.baseCurrency }));
  }, [preferences.baseCurrency]);

  // Update simulated weather info upon destination plan change
  useEffect(() => {
    if (plan?.destination) {
      setWeatherLoading(true);
      const timer = setTimeout(() => {
        const data = getSimulatedWeather(plan.destination);
        setWeatherData(data);
        setWeatherLoading(false);
      }, 500); // realistic latency
      return () => clearTimeout(timer);
    } else {
      setWeatherData(null);
    }
  }, [plan?.destination]);

  // Load future-proof integration diagnostics data in the background
  useEffect(() => {
    if (plan) {
      setDiagnosticsLoading(true);
      const loadDiag = async () => {
        try {
          const rateDetails = await getLiveExchangeRate(preferences.baseCurrency, plan.currency.code);
          setLiveRate(rateDetails.rate);

          if (plan.locationDetails?.city) {
            const traffic = await getTrafficStatus(plan.locationDetails.city);
            setLiveTrafficStatus(`${traffic.status.toUpperCase()} (${traffic.congestionLevelPercent}% congestion)`);

            const events = await getRealtimeEvents(plan.locationDetails.city, plan.travelStyle);
            setLiveEventsList(events);
          }
        } catch (err) {
          console.error("Diagnostics load error", err);
        } finally {
          setDiagnosticsLoading(false);
        }
      };
      loadDiag();
    }
  }, [plan, preferences.baseCurrency]);

  const handleRefreshWeather = () => {
    if (!plan?.destination) return;
    setWeatherLoading(true);
    setTimeout(() => {
      setWeatherData(getSimulatedWeather(plan.destination));
      setWeatherLoading(false);
    }, 600);
  };

  // Fun travel preparation logs
  const loadingSteps = [
    "Contacting local micro-satellites for real-time wind and cloud forecasts...",
    "Querying regional multi-currency budget models...",
    "Scouting boutique accommodations & cultural landmarks...",
    "Arranging travel guides and analyzing dietary safety precautions...",
    "Weaving a personalized day-by-day itinerary canvas..."
  ];

  // Rotate loading step messages
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Handle click on preset starter cards
  const handleSelectPreset = (preset: TravelPreset) => {
    setInputs({
      destination: preset.destination,
      budget: preset.budget,
      days: preset.days,
      travelStyle: preset.travelStyle,
      constraints: preset.constraints,
      preferredCurrency: preset.demoData.currency.code
    });
    setAdjustedBudget(preset.budget);
    setError(null);
  };

  // Launch pre-packaged high-fidelity demo preset instantly
  const handleLaunchDemo = (presetName: string) => {
    const selected = TRAVEL_PRESETS.find(p => p.name === presetName);
    if (selected) {
      handleSelectPreset(selected);
      setLoading(true);
      setTimeout(() => {
        setPlan(selected.demoData);
        setAdjustedBudget(selected.demoData.budget);
        setLoading(false);
        setActiveTab("itinerary");
        setSelectedDay(1);
        setError(null);
      }, 1500);
    }
  };

  // Plan trip via express server endpoint loaded with Gemini AI
  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.destination.trim()) {
      setError({ type: "input", message: "Please enter a travel destination (such as Paris, France)." });
      return;
    }

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

      const response = await fetch("/api/plan-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to generate travel plan.");
      }

      setPlan(data);
      setAdjustedBudget(data.budget);
      setActiveTab("itinerary");
      setSelectedDay(1);
    } catch (err: any) {
      console.error(err);
      setError({
        type: err.name === "AbortError" ? "timeout" : "network",
        message: err.message || "Something went wrong while communicating with TravelGenie's planning server. Please check your internet connection or launch a demo."
      });
    } finally {
      setLoading(false);
    }
  };

  // Favorites heart toggler
  const toggleFavorite = (dayIndex: number, actIndex: number) => {
    const key = `${dayIndex}-${actIndex}`;
    setFavorites(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Packing checklist toggler
  const togglePackingItem = (itemText: string) => {
    setCheckedPacking(prev => ({ ...prev, [itemText]: !prev[itemText] }));
  };

  // Copy plain text itinerary details safely to computer clipboard
  const handleCopyItinerary = () => {
    if (!plan) return;
    let txt = `TRAVELGENIE PERSONAL PLANNER GUIDE: ${plan.destination.toUpperCase()}\n`;
    txt += `Travel Style Category: ${plan.travelStyle} | Duration: ${plan.days} Days\n`;
    txt += `Selected Budget Option: ${plan.currency.symbol}${adjustedBudget.toLocaleString()} ${plan.currency.code}\n`;
    if (plan.locationDetails) {
      txt += `Country: ${plan.locationDetails.country} | Region: ${plan.locationDetails.city} | Local Timezone: ${plan.locationDetails.timezone}\n`;
    }
    txt += `\n`;
    
    plan.itinerary.forEach((dayPlan) => {
      txt += `DAY ${dayPlan.day}: ${dayPlan.title}\n`;
      dayPlan.activities.forEach((act) => {
        const costFactor = adjustedBudget / plan.budget;
        const currentCost = Math.round(act.estimatedCost * costFactor);
        txt += ` - [${act.timeOfDay}] ${act.title} @ ${act.locationName} (${plan.currency.symbol}${currentCost.toLocaleString()})\n`;
        txt += `   ${act.description}\n`;
      });
      txt += `\n`;
    });

    navigator.clipboard.writeText(txt);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  // Resolve micro icons dynamically from lucide types
  const getActivityIcon = (iconType: string) => {
    switch (iconType) {
      case "beach": return <Palmtree className="w-4 h-4 text-emerald-600" />;
      case "utensils": return <Utensils className="w-4 h-4 text-amber-600" />;
      case "bike": return <Flame className="w-4 h-4 text-orange-600" />;
      case "landmark": return <Compass className="w-4 h-4 text-indigo-600" />;
      case "coffee": return <Compass className="w-4 h-4 text-rose-600" />; 
      case "moon": return <Moon className="w-4 h-4 text-purple-600" />;
      case "shopping": return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      case "tree": return <Trees className="w-4 h-4 text-teal-600" />;
      case "bus": return <Bus className="w-4 h-4 text-blue-600" />;
      case "walk": return <Activity className="w-4 h-4 text-stone-600" />;
      default: return <Info className="w-4 h-4 text-stone-600" />;
    }
  };

  // Compute scaled cost values on-the-fly dynamically
  const getScaledCost = (originalVal: number) => {
    if (!plan) return originalVal;
    const factor = adjustedBudget / plan.budget;
    return Math.round(originalVal * factor);
  };

  const currentCurrency = plan?.currency || { code: "USD", symbol: "$" };

  // Calculate dynamic sustainability labels matching calculated daily costs
  const getBudgetSustainability = () => {
    if (!plan) return { label: "Balanced", color: "bg-emerald-50 text-emerald-800 border-emerald-100", description: "Standard comfort balance." };
    const perDayValue = adjustedBudget / plan.days;
    if (perDayValue < 75) {
      return {
        label: "Economy Class",
        color: "bg-rose-50 text-rose-800 border-rose-100",
        description: "Focus on street markets, shared hostels, and free parks."
      };
    } else if (perDayValue < 150) {
      return {
        label: "Smart Budget-Conscious",
        color: "bg-amber-50 text-amber-800 border-amber-100",
        description: "Excellent mix of home-stays, bistros, and bus routes."
      };
    } else if (perDayValue < 350) {
      return {
        label: "Moderate Boutique Comfort",
        color: "bg-emerald-50 text-emerald-800 border-emerald-100",
        description: "Comfortable private hotel rooms, private cabs, and dynamic dining."
      };
    } else {
      return {
        label: "Premium Lux Travel",
        color: "bg-indigo-50 text-indigo-800 border-indigo-100",
        description: "Superb high-end dining, boutique hotels, and VIP private guides."
      };
    }
  };

  const currentSustainability = getBudgetSustainability();

  // Progress metrics calculation for packing items
  const totalPackingItems = plan?.packingList.length || 0;
  const packedCount = plan?.packingList.filter(item => checkedPacking[item.item]).length || 0;
  const packingProgressPercent = totalPackingItems ? Math.round((packedCount / totalPackingItems) * 100) : 0;

  // Search filtered results for configurable destinations list
  const filteredDestinations = destinationsList.filter(dest => {
    const q = destSearchQuery.toLowerCase();
    return (
      dest.city.toLowerCase().includes(q) ||
      dest.country.toLowerCase().includes(q) ||
      dest.name.toLowerCase().includes(q) ||
      dest.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Action: Add custom destination profile
  const handleSaveCustomDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestForm.name || !newDestForm.city || !newDestForm.country) {
      alert("Please fill in Name, City, and Country parameters.");
      return;
    }

    if (editingDestId) {
      setDestinationsList(prev => prev.map(d => d.id === editingDestId ? {
        ...d,
        ...newDestForm
      } : d));
      setEditingDestId(null);
    } else {
      const added: ManagedDestination = {
        id: `dest_custom_${Date.now()}`,
        ...newDestForm
      };
      setDestinationsList(prev => [added, ...prev]);
    }

    // Reset Form state
    setNewDestForm({
      name: "",
      city: "",
      country: "",
      timezone: "GMT",
      currencyCode: "USD",
      currencySymbol: "$",
      lat: 0.0,
      lng: 0.0,
      tags: ["Explore"],
      description: ""
    });
    setIsAddingCustomDest(false);
  };

  const handleDeleteDestination = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to remove this configured destination from your local directory?")) {
      setDestinationsList(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleEditDestination = (dest: ManagedDestination, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDestId(dest.id);
    setNewDestForm({
      name: dest.name,
      city: dest.city,
      country: dest.country,
      timezone: dest.timezone,
      currencyCode: dest.currencyCode,
      currencySymbol: dest.currencySymbol,
      lat: dest.lat,
      lng: dest.lng,
      tags: dest.tags,
      description: dest.description
    });
    setIsAddingCustomDest(true);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2F2D2A] flex flex-col font-sans transition-all duration-300 print:bg-white print:text-black">
      
      {/* 1. BRANDED HEADER HEADER */}
      <header className="border-b border-[#EBE6DC] bg-[#FAF8F4]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 print:hidden shadow-xs">
        <div id="nav-container" className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPlan(null)}>
            <div className="bg-[#D16C27] text-white p-2.5 rounded-xl shadow-inner flex items-center justify-center transition-transform hover:rotate-12 duration-300">
              <Compass className="w-5.3 h-5.3" />
            </div>
            <div>
              <h1 id="app-logo-text" className="font-display font-black text-xl tracking-tight text-stone-900 flex items-center space-x-1.5">
                <span>Travel</span>
                <span className="text-[#D16C27] font-semibold">Genie</span>
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-wider text-stone-400">Global AI Trip Planner</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            
            {/* Country flag and base currency shortcut button */}
            <button
               onClick={() => setIsPrefOpen(true)}
               className="bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-[#DECEB6] px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-stone-700 flex items-center space-x-2 transition-all cursor-pointer shadow-subtle"
               title="Configure User Preference Profile"
               id="prefs-trigger"
            >
              <Globe className="w-3.5 h-3.5 text-[#D16C27]" />
              <span>{preferences.homeCountry}</span>
              <span className="text-stone-300">|</span>
              <span className="text-[#D16C27] font-bold">{preferences.baseCurrency}</span>
              <Settings className="w-3.5 h-3.5 text-stone-400 transition-transform hover:rotate-45" />
            </button>

            {/* Configurable Destinations Directory button */}
            <button
              onClick={() => setIsDestManagerOpen(true)}
              className="bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-[#DECEB6] p-2 rounded-xl text-[#2F2D2A] transition-all cursor-pointer shadow-subtle flex items-center space-x-1.5"
              title="Global Destination Directory"
            >
              <MapPin className="w-4 h-4 text-[#D16C27]" />
              <span className="text-xs font-semibold hidden sm:inline">Destinations Hub</span>
            </button>
            
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-center">
        
        {/* If no plan is generated yet, show input parameters & preset explorer */}
        {!plan && !loading && (
          <div className="space-y-8 max-w-5xl mx-auto w-full">
            
            {/* Visual Intro banner */}
            <div className="text-center space-y-3 py-2">
              <span className="px-3.5 py-1 bg-[#F5EAD6] text-[#A65B24] text-[10px] font-mono font-bold uppercase rounded-full tracking-wider border border-[#E9DAC1]/50">
                ✨ Globally Scalable Itinerary Engine
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-stone-900 tracking-tight leading-tight">
                Plan Worldwide Trips Instantly
              </h2>
              <p className="max-w-2xl mx-auto text-sm md:text-base text-stone-500 font-light">
                Simply specify parameters in your favorite currency, or click a pre-saved destination from your custom personal directory below!
              </p>
            </div>

            {/* SECTIONS LAYOUT: Config Form (Left) & Configurable Destination Manager (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Form Input parameters - spans 7 units */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EBE6DC] shadow-sm p-6 md:p-8 space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-[#F4EFE5]">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#D16C27] animate-pulse" />
                    <h3 className="font-display font-bold text-lg text-stone-950">Configure Trip Parameters</h3>
                  </div>
                  
                  {/* Local fast currency selection matching user preferences */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-stone-400">CURRENCY</span>
                    <select
                      value={inputs.preferredCurrency}
                      onChange={(e) => setInputs({ ...inputs, preferredCurrency: e.target.value })}
                      className="bg-[#FAF8F5] border border-[#DECEB6] rounded-lg px-2 py-1 text-xs font-mono font-bold text-[#D16C27] focus:outline-none focus:ring-1 focus:ring-[#D16C27]"
                    >
                      {["USD", "INR", "EUR", "GBP", "AED", "SGD", "JPY", "CAD", "AUD"].map((cCode) => (
                        <option key={cCode} value={cCode}>{cCode}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <form onSubmit={handlePlanTrip} className="space-y-6">
                  
                  {/* Destination Map Input */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-stone-500 block">
                      Target Destination Worldwide *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. Paris, France, or Delhi, India, or New York, USA..."
                        value={inputs.destination}
                        onChange={(e) => setInputs({ ...inputs, destination: e.target.value })}
                        className="w-full text-sm bg-[#FAF8F4] border border-[#DECEB6] rounded-xl pl-11 pr-4 py-3.5 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D16C27] focus:border-[#D16C27] transition-all font-medium text-stone-850"
                        id="input-destination"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Budget level */}
                    <div className="space-y-2">
                      <label id="budget-heading" className="text-xs uppercase font-mono tracking-wider font-bold text-stone-500 block">
                        Target Budget ({inputs.preferredCurrency}) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-mono font-medium text-sm">
                          {inputs.preferredCurrency === "INR" ? "₹" :
                           inputs.preferredCurrency === "EUR" ? "€" :
                           inputs.preferredCurrency === "GBP" ? "£" :
                           inputs.preferredCurrency === "AED" ? "د.إ" :
                           inputs.preferredCurrency === "SGD" ? "S$" :
                           inputs.preferredCurrency === "JPY" ? "¥" : "$"}
                        </span>
                        <input
                          type="number"
                          min="100"
                          max="50000"
                          value={inputs.budget}
                          onChange={(e) => setInputs({ ...inputs, budget: parseInt(e.target.value) || 0 })}
                          className="w-full text-sm bg-[#FAF8F4] border border-[#DECEB6] rounded-xl pl-8 pr-4 py-3 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D16C27] focus:border-[#D16C27] transition-all font-mono font-bold"
                          id="input-budget"
                          aria-labelledby="budget-heading"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400 px-1">
                        <span>Low: 800</span>
                        <span>Moderate: 2500</span>
                        <span>High Boutique: 6000+</span>
                      </div>
                    </div>

                    {/* Trip duration Days */}
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-mono tracking-wider font-bold text-stone-500 block">
                        Trip Duration ({inputs.days} Days) *
                      </label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-stone-400" />
                        <input
                          type="range"
                          min="1"
                          max="14"
                          value={inputs.days}
                          onChange={(e) => setInputs({ ...inputs, days: parseInt(e.target.value) })}
                          className="flex-1 accent-[#D16C27] h-1.5 bg-[#FAF1E3] rounded-lg cursor-pointer"
                          id="input-days"
                        />
                        <span className="font-mono text-xs font-bold bg-[#FAF8F4] border border-[#DECEB6] px-3 py-1.8 rounded-lg min-w-[52px] text-center">
                          {inputs.days}d
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Personal constraints & preferences */}
                  <div className="space-y-2">
                    <label id="constraints-label" className="text-xs uppercase font-mono tracking-wider font-bold text-stone-500 block">
                      Custom Preferences / Travel Constraints
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian cafes, organic farms, low walking steps, baby trolley..."
                      value={inputs.constraints}
                      onChange={(e) => setInputs({ ...inputs, constraints: e.target.value })}
                      className="w-full text-sm bg-[#FAF8F4] border border-[#DECEB6] rounded-xl px-4 py-3 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D16C27] focus:border-[#D16C27] transition-all"
                      id="input-constraints"
                      aria-labelledby="constraints-label"
                    />
                  </div>

                  {/* Core travel styles selection */}
                  <div className="space-y-3">
                    <label className="text-xs uppercase font-mono tracking-wider font-bold text-stone-500 block">
                      Select Travel Style Profile *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { style: "Cultural", emoji: "🏛️", detail: "Museums & History" },
                        { style: "Relaxed", emoji: "🌴", detail: "Spas & Leisures" },
                        { style: "Adventure", emoji: "⛰️", detail: "Hikes & Activities" },
                        { style: "Foodie", emoji: "🍕", detail: "Eateries & Cuisines" },
                        { style: "Backpacking", emoji: "🎒", detail: "Sustainable Budget" },
                        { style: "Family", emoji: "👪", detail: "Kid-safe spots" }
                      ].map(({ style, emoji, detail }) => {
                        const isSelected = inputs.travelStyle === style;
                        return (
                          <button
                            type="button"
                            key={style}
                            onClick={() => setInputs({ ...inputs, travelStyle: style })}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                              isSelected 
                              ? "bg-[#D16C27]/10 border-[#D16C27] text-[#A65B24] shadow-xs scale-102 font-semibold" 
                              : "bg-[#FAF8F4] border-[#E8E2D4] hover:bg-[#FAF8F5] text-stone-700 hover:border-stone-400"
                            }`}
                            id={`style-btn-${style.toLowerCase()}`}
                          >
                            <span className="text-xl">{emoji}</span>
                            <span className="text-xs block">{style}</span>
                            <span className="text-[9px] font-light text-stone-400 font-mono select-none">{detail}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {error?.type === "input" && (
                    <div className="p-3 bg-red-50 border border-red-205 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error.message}</span>
                    </div>
                  )}

                  {/* Planner execution button details */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#D16C27] hover:bg-[#B35215] text-white font-semibold py-3 px-8 rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2 hover:shadow-lg"
                      id="btn-generate-plan"
                    >
                      <Sparkles className="w-4.5 h-4.5" />
                      <span>AI Plan Dynamic Itinerary</span>
                    </button>
                  </div>

                </form>
              </div>

              {/* SAVED DESTINATION DIRECTORY (Right side column) - spans 5 units */}
              <div className="lg:col-span-5 bg-[#FAF8F4] rounded-3xl border border-[#EBE6DC] p-5 space-y-5">
                
                <div className="flex items-center justify-between border-b border-[#EDE7DD] pb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4.5 h-4.5 text-[#D16C27]" />
                    <span className="font-display font-semibold text-base text-stone-900">Destination Directory</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsAddingCustomDest(true);
                      setEditingDestId(null);
                    }}
                    className="bg-[#D16C27]/10 hover:bg-[#D16C27]/20 text-[#A65B24] p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Add Custom</span>
                  </button>
                </div>

                {/* Directory Search block */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search cached destinations directory..."
                    value={destSearchQuery}
                    onChange={(e) => setDestSearchQuery(e.target.value)}
                    className="w-full text-xs bg-white border border-[#DECEB6] rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#D16C27]"
                  />
                  {destSearchQuery && (
                    <button onClick={() => setDestSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Directory Cards list */}
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredDestinations.map(dest => (
                    <div
                      key={dest.id}
                      onClick={() => {
                        setInputs(prev => ({
                          ...prev,
                          destination: `${dest.city}, ${dest.country}`,
                          preferredCurrency: dest.currencyCode
                        }));
                      }}
                      className="bg-white p-3.5 rounded-2xl border border-[#EBE6DC] hover:border-[#D16C27] hover:shadow-xs transition-all cursor-pointer group relative"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#A65B24] font-mono block">
                            {dest.city}, {dest.country}
                          </span>
                          <h4 className="font-display font-bold text-sm text-stone-900 group-hover:text-[#D16C27] transition-colors">
                            {dest.name}
                          </h4>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center space-x-1 opacity-65 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => handleEditDestination(dest, e)}
                            className="p-1 hover:bg-stone-100 rounded text-stone-600"
                            title="Edit destination parameters"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteDestination(dest.id, e)}
                            className="p-1 hover:bg-red-50 rounded text-red-600"
                            title="Delete custom location"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500 font-light line-clamp-2 mt-1 leading-normal">
                        {dest.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-[9px] bg-stone-100 text-stone-600 font-mono px-1.5 py-0.2 rounded">
                          🕒 {dest.timezone}
                        </span>
                        <span className="text-[9px] bg-orange-50 text-[#A65B24] font-mono px-1.5 py-0.2 rounded font-bold">
                          👛 {dest.currencySymbol} ({dest.currencyCode})
                        </span>
                        {dest.tags.map(t => (
                          <span key={t} className="text-[9px] bg-stone-50 text-stone-500 px-1.5 py-0.2 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>

                    </div>
                  ))}

                  {filteredDestinations.length === 0 && (
                    <div className="text-center py-8 bg-white border border-dashed border-stone-200 rounded-2xl">
                      <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-1.5" />
                      <p className="text-xs text-stone-400 font-light">No destinations matching query.</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-stone-100/50 border border-stone-200 rounded-xl text-[10.5px] text-stone-500 leading-snug">
                  ✨ <strong>Tip:</strong> Click any destination card above to instantly auto-fill target inputs and prep local state for the planning algorithm!
                </div>

              </div>

            </div>

            {/* QUICK HIGH-FIDELITY STARTERS */}
            <div className="space-y-3.5 pt-4">
              <div className="flex items-center space-x-2">
                <Compass className="w-4.5 h-4.5 text-[#D16C27]" />
                <h3 className="font-display font-semibold text-base text-stone-900">Explore High-Fidelity Pre-Planned Demos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TRAVEL_PRESETS.map((preset) => (
                  <div 
                    key={preset.name}
                    className="bg-white rounded-2xl p-5 border border-[#DECEB6] hover:shadow-md transition-all group relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-0 right-0 h-1.5 w-full bg-[#DECEB6] group-hover:bg-[#D16C27] transition-colors"></div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-start pt-1">
                        <span className="text-[9px] uppercase font-mono font-black tracking-widest text-[#D16C27] bg-[#FAF1E3] px-2.5 py-0.5 rounded-full">
                          {preset.badge}
                        </span>
                        <span className="text-xs font-semibold font-mono text-stone-505">
                          {preset.days} Days / {preset.demoData.currency.symbol}{preset.budget} {preset.demoData.currency.code}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-base text-stone-900 group-hover:text-[#D16C27] transition-colors">
                        {preset.name}
                      </h3>
                      <p className="text-[11.5px] text-stone-500 font-light leading-relaxed">
                        <strong>Preferences:</strong> {preset.constraints || "Minimal constraints"}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-4 border-t border-stone-100 mt-3">
                      <button
                        onClick={() => handleLaunchDemo(preset.name)}
                        className="flex-1 bg-[#FAF1E3] hover:bg-[#ECD9BC] text-stone-800 py-1.8 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        ⚡ Simulate High-Fi Demo Tour
                      </button>
                      <button
                        onClick={() => handleSelectPreset(preset)}
                        className="bg-[#D16C27]/10 hover:bg-[#D16C27]/20 text-[#A65B24] p-1.8 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Import preset into target dials"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. LOADING PROGRESS SCREEN */}
        {loading && (
          <div className="max-w-xl mx-auto w-full py-16 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#EBE6DC] border-t-[#D16C27] animate-spin"></div>
              <Compass className="w-10 h-10 text-[#D16C27] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-medium text-lg text-stone-900">
                Curating Intelligent Itinerary
              </h3>
              
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-mono text-[#A65B24]"
                >
                  {loadingSteps[loadingStep]}
                </motion.p>
              </AnimatePresence>

              <p className="text-[9px] text-stone-400 uppercase tracking-widest pt-4 font-mono">
                Powered by Gemini 3.5 AI Engine
              </p>
            </div>
          </div>
        )}

        {/* 4. ERROR DISPLAY SCREEN */}
        {error && error.type !== "input" && !loading && (
          <div className="max-w-xl mx-auto w-full bg-white rounded-3xl border border-red-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-red-700">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <h4 className="font-display font-semibold text-base">Itinerary Assembly Failed</h4>
            </div>
            
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {error.message}
            </p>
            
            <div className="bg-[#FAF8F5] border border-[#DECEB6] rounded-2xl p-4 space-y-2">
              <h5 className="text-xs font-bold text-stone-800">💡 Easy Resolution Step:</h5>
              <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                Since we enforce strict security proxy layers, your API key can be parsed from settings. Ensure the <strong>GEMINI_API_KEY</strong> is set in the **Settings &gt; Secrets** tab, or load a high-fidelity preset instantly to inspect features:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {TRAVEL_PRESETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => handleLaunchDemo(p.name)}
                    className="bg-[#D16C27] hover:bg-[#B35215] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Load {p.name.split(" ")[0]} Project
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4">
              <button
                onClick={() => setError(null)}
                className="text-xs font-medium text-[#D16C27] hover:underline cursor-pointer"
              >
                ← Back to configuration
              </button>
            </div>
          </div>
        )}

        {/* 5. TRAVELGENIE IMMERSIVE DASHBOARD VIEW */}
        {plan && !loading && !error && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Dashboard Header toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE6DC] pb-6 print:hidden">
              <div className="space-y-1">
                <button
                  onClick={() => setPlan(null)}
                  className="text-xs font-bold text-[#D16C27] hover:text-[#B35215] flex items-center space-x-1 mb-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Configure New Trip Parameters</span>
                </button>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="text-2xl md:text-3.5xl font-display font-bold text-stone-900 tracking-tight">
                    {plan.destination}
                  </h2>
                  {plan.locationDetails && (
                    <span className="bg-[#FAF1E3] text-[#A65B24] border border-[#ECD9BC] text-[10px] font-mono px-2 py-0.5 rounded-md">
                      📍 {plan.locationDetails.lat.toFixed(2)}°, {plan.locationDetails.lng.toFixed(2)}°
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs font-light text-stone-500">
                  <span className="px-2.5 py-0.5 bg-stone-100 rounded-full font-mono font-medium">
                    {plan.days} Days Length
                  </span>
                  <span>•</span>
                  <span className="px-2.5 py-0.5 bg-[#FAF1E3] text-[#A65B24] rounded-full font-medium">
                    {plan.travelStyle} Theme
                  </span>
                  {inputs.constraints && (
                    <>
                      <span>•</span>
                      <span className="text-stone-400 italic">"{inputs.constraints}"</span>
                    </>
                  )}
                </div>
              </div>

              {/* Utility Exports */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyItinerary}
                  className="bg-white hover:bg-stone-50 text-stone-700 border border-[#DECEB6] py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer shadow-subtle"
                >
                  <Share2 className="w-4 h-4 text-stone-500" />
                  <span>{shareSuccess ? "Itinerary Saved!" : "Copy Text Guide"}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-[#D16C27] hover:bg-[#B35215] text-white py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer shadow-subtle"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Print Plan</span>
                </button>
              </div>
            </div>

            {/* Dashboard Workspace grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT CHANNEL: Metrics, Weather, FX, System Port */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EBE6DC] p-5 space-y-5 print:border-none print:p-0">
                
                <h3 className="font-display font-semibold text-base text-stone-900 flex items-center space-x-2 border-b border-[#F4EFE5] pb-3">
                  <Briefcase className="w-4.5 h-4.5 text-[#D16C27]" />
                  <span>Journey Cost Monitor</span>
                </h3>

                {/* Main Budget Dial */}
                <div className="text-center py-4 bg-[#FAF8F4] rounded-2xl border border-[#FAF1E3] space-y-1 relative overflow-hidden">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-stone-400 block">Total Plan Cost</span>
                  <p className="text-3xl font-display font-black text-stone-900 tracking-tight">
                    {currentCurrency.symbol}{adjustedBudget.toLocaleString()}
                    <span className="text-xs font-mono font-medium ml-1 text-stone-400">{currentCurrency.code}</span>
                  </p>
                  <p className="text-[10px] text-stone-500 font-light font-mono">
                    Average: {currentCurrency.symbol}{Math.round(adjustedBudget / plan.days)} / day
                  </p>
                </div>

                {/* Cost Sustainability Warn Gauge */}
                <div className={`p-4 rounded-2xl border ${currentSustainability.color} transition-all duration-300`}>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Sustainability Standard</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  </div>
                  <h4 className="font-display font-black text-sm mt-1">{currentSustainability.label}</h4>
                  <p className="text-[10.5px] font-light mt-0.5 leading-normal opacity-90">{currentSustainability.description}</p>
                </div>

                {/* Cost sliders */}
                <div className="space-y-3 pt-2 print:hidden">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900 font-display">Tweak Cost Scale Slider</span>
                    <span className="text-[9px] font-mono bg-stone-100 text-stone-400 px-1.5 py-0.2 rounded font-bold">Reactive</span>
                  </div>
                  
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={Math.round(plan.budget * 0.4)}
                      max={Math.round(plan.budget * 2.5)}
                      value={adjustedBudget}
                      onChange={(e) => setAdjustedBudget(parseInt(e.target.value) || 0)}
                      className="w-full accent-[#D16C27] h-1.5 bg-[#FAF1E3] rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-stone-400">
                      <span>{currentCurrency.symbol}{Math.round(plan.budget * 0.4).toLocaleString()}</span>
                      <span>{currentCurrency.symbol}{Math.round(plan.budget * 2.5).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-400 font-light leading-normal">
                    Drag the cost index dial to dynamically scale accommodation types, meal options, excursion packages, and tips instantly.
                  </p>
                </div>

                {/* Dynamic Weather widget */}
                <div className="bg-[#FAF8F4] border border-[#EBE6DC] rounded-2xl p-4 space-y-4 print:hidden">
                  
                  <div className="flex items-center justify-between border-b border-[#FAF1E3] pb-2.5">
                    <div className="flex items-center space-x-2">
                      <div className="bg-[#D16C27]/10 p-1.5 rounded-lg text-[#A65B24]">
                        <Sun className="w-4 h-4 animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-xs text-stone-900">
                          Destination Weather
                        </h4>
                        <p className="text-[9px] font-mono uppercase text-stone-400">
                          Simulated Meteorological Feed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="bg-stone-200/60 p-0.5 rounded-lg flex text-[9px] font-mono">
                        <button
                          onClick={() => setTempUnit("C")}
                          className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                            tempUnit === "C" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
                          }`}
                        >
                          °C
                        </button>
                        <button
                          onClick={() => setTempUnit("F")}
                          className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                            tempUnit === "F" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
                          }`}
                        >
                          °F
                        </button>
                      </div>

                      <button
                        onClick={handleRefreshWeather}
                        disabled={weatherLoading}
                        className={`p-1.5 hover:bg-stone-200/50 rounded-lg text-stone-500 hover:text-stone-900 transition-all cursor-pointer ${
                          weatherLoading ? "animate-spin" : ""
                        }`}
                        title="Synchronize meteorological stats"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {weatherLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center space-y-1.5 text-center">
                      <RefreshCw className="w-5 h-5 text-[#D16C27] animate-spin" />
                      <p className="text-[9px] font-mono text-stone-400">Ping coordinates & satellite grids...</p>
                    </div>
                  ) : weatherData ? (
                    <div className="space-y-3">
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-bold text-stone-400 uppercase font-mono block">Situation Report</span>
                          <span className="text-xs font-bold text-stone-700 block leading-tight">
                            {weatherData.condition}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2.5xl font-black font-mono tracking-tight text-stone-900">
                            {tempUnit === "C" 
                              ? `${weatherData.currentTemp}°` 
                              : `${Math.round(weatherData.currentTemp * 1.8 + 32)}°`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Micro dials */}
                      <div className="grid grid-cols-3 gap-1.5 py-1.8 border-t border-b border-[#FAF1E3]">
                        <div className="text-center space-y-0.5">
                          <span className="text-[8.5px] font-mono text-stone-400 uppercase flex items-center justify-center">
                            <Thermometer className="w-2.5 h-2.5 text-red-500 mr-0.5" />
                            UV Index
                          </span>
                          <span className="text-xs font-bold font-mono text-stone-700">
                            {weatherData.uvIndex}/10
                          </span>
                        </div>
                        <div className="text-center space-y-0.5">
                          <span className="text-[8.5px] font-mono text-stone-400 uppercase flex items-center justify-center">
                            <Droplets className="w-2.5 h-2.5 text-blue-500 mr-0.5" />
                            Humidity
                          </span>
                          <span className="text-xs font-bold font-mono text-stone-700">
                            {weatherData.humidity}%
                          </span>
                        </div>
                        <div className="text-center space-y-0.5">
                          <span className="text-[8.5px] font-mono text-stone-400 uppercase flex items-center justify-center">
                            <Wind className="w-2.5 h-2.5 text-amber-500 mr-0.5" />
                            Wind
                          </span>
                          <span className="text-xs font-bold font-mono text-stone-700">
                            {weatherData.windSpeed} km/h
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-stone-500 font-light leading-relaxed italic">
                          "{weatherData.statusText}"
                        </p>
                        <div className="p-2 bg-[#FAF1E3]/45 border border-[#FAF1E3] rounded-xl text-[10px] text-[#A65B24]">
                          <strong>Target Customs Note:</strong> {weatherData.seasonalTip}
                        </div>
                      </div>

                      {/* Best suggested gears */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-mono font-bold text-stone-400 tracking-wider block">
                          Suggested Packing Accessories:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {weatherData.bestGear.map((g, idx) => (
                            <span 
                              key={idx} 
                              className="text-[9px] bg-white text-stone-600 px-2 py-0.5 rounded border border-stone-200"
                            >
                              🎒 {g}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <p className="text-[10px] text-stone-400 italic">Meteorological details offline.</p>
                  )}
                </div>

                {/* Quick tab controls */}
                <div className="flex flex-col gap-2 pt-1.5 print:hidden">
                  {[
                    { id: "itinerary", label: "📅 Day timeline stops", desc: "Interactive map points & hours" },
                    { id: "budget", label: "📊 Intelligent Expense allocations", desc: "Interactive breakdown charts" },
                    { id: "concierge", label: "🧳 Smart packing & local logs", desc: "Checklist and custom cautions" },
                    { id: "architecture", label: "🔌 API Gateway Sandbox Port", desc: "Ready real-time backend integrations" }
                  ].map((tb) => {
                    const isSelected = activeTab === tb.id;
                    return (
                      <button
                        key={tb.id}
                        onClick={() => setActiveTab(tb.id as any)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-center cursor-pointer ${
                          isSelected 
                          ? "bg-[#D16C27]/5 border-[#D16C27] text-[#A65B24]" 
                          : "bg-stone-50/70 border-stone-100 hover:bg-stone-50 text-stone-600"
                        }`}
                      >
                        <span className="font-bold">{tb.label}</span>
                        <span className="text-[10px] font-light text-stone-400 mt-0.5 leading-none">{tb.desc}</span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT DISPLAY PANEL: Tabs Workspace */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EBE6DC] min-h-[500px] overflow-hidden">
                
                {/* Tab selector bar */}
                <div className="flex border-b border-[#F4EFE5] bg-[#FAF8F4] px-4 md:px-6 print:hidden overflow-x-auto no-scrollbar">
                  {[
                    { id: "itinerary", label: "📅 Timeline Schedule" },
                    { id: "budget", label: "📊 Cost Allocation" },
                    { id: "concierge", label: "🧳 Packing & Concierge" },
                    { id: "architecture", label: "🔌 Integration Sandbox Port" }
                  ].map((tb) => {
                    const isSelected = activeTab === tb.id;
                    return (
                      <button
                        key={tb.id}
                        onClick={() => setActiveTab(tb.id as any)}
                        className={`py-4 px-3 text-xs font-bold relative transition-colors focus:outline-none cursor-pointer whitespace-nowrap ${
                          isSelected ? "text-[#D16C27]" : "text-stone-500 hover:text-stone-900"
                        }`}
                      >
                        <span>{tb.label}</span>
                        {isSelected && (
                          <motion.div 
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D16C27]" 
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: Timeline Stops */}
                {activeTab === "itinerary" && (
                  <div className="p-4 md:p-6 space-y-6">
                    
                    <div className="flex space-x-1.5 overflow-x-auto pb-3 border-b border-stone-100 no-scrollbar print:hidden">
                      {plan.itinerary.map((dayPlan) => {
                        const isSelected = selectedDay === dayPlan.day;
                        return (
                          <button
                            key={dayPlan.day}
                            onClick={() => setSelectedDay(dayPlan.day)}
                            className={`px-3.5 py-1.8 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                              isSelected 
                              ? "bg-[#D16C27] text-white shadow-sm" 
                              : "bg-[#FAF8F4] text-stone-600 hover:bg-[#F3EFE9]"
                            }`}
                          >
                            Day {dayPlan.day}
                          </button>
                        );
                      })}
                    </div>

                    {plan.itinerary.map((dayPlan) => {
                      if (dayPlan.day !== selectedDay) return null;
                      return (
                        <motion.div
                          key={dayPlan.day}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div className="flex items-center justify-between border-b border-dashed border-stone-200 pb-3">
                            <div>
                              <h4 className="font-display font-bold text-base text-stone-900">
                                Day {dayPlan.day}: {dayPlan.title}
                              </h4>
                              <p className="text-[10px] font-mono text-[#D16C27]">
                                Dynamic Schedule Stop Profile
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-stone-400 block font-mono">Day budget</span>
                              <span className="font-display font-bold text-sm text-stone-800">
                                {currentCurrency.symbol}{Math.round(dayPlan.dayCost * (adjustedBudget / plan.budget)).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* RENDER DAYS TIMELINE VERTICAL PROGRESS */}
                          <div className="relative border-l-2 border-[#FAF1E3] pl-6 md:pl-8 space-y-5 ml-4 py-1.5">
                            {dayPlan.activities.map((act, idx) => {
                              const key = `${dayPlan.day}-${idx}`;
                              const isFav = favorites[key];
                              return (
                                <div key={idx} className="relative group">
                                  
                                  {/* Floating node dot with categories */}
                                  <div className="absolute -left-[37px] md:-left-[45px] top-1 w-7 h-7 rounded-xl bg-white border border-[#DECEB6] shadow-2xs flex items-center justify-center group-hover:border-[#D16C27] transition-colors bg-[#FAF8F5]">
                                    {getActivityIcon(act.iconType)}
                                  </div>

                                  <div className="space-y-1.5 bg-[#FAF8F4]/40 hover:bg-[#FAF8F4]/90 border border-transparent hover:border-[#EBE6DC] p-3 rounded-2xl transition-all">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-0.5">
                                        <div className="flex items-center space-x-1.5 flex-wrap">
                                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#A65B24] bg-[#FAF1E3] px-1.8 py-0.2 rounded">
                                            {act.timeOfDay}
                                          </span>
                                          <span className="text-[10.5px] text-stone-400 flex items-center font-light">
                                            <MapPin className="w-3 h-3 mr-0.5 text-stone-400" />
                                            {act.locationName}
                                          </span>
                                        </div>
                                        <h5 className="font-display font-bold text-stone-900 text-sm leading-tight pt-1">
                                          {act.title}
                                        </h5>
                                      </div>

                                      <div className="flex items-center space-x-1.5">
                                        <span className="text-xs font-mono font-bold text-stone-605 bg-[#FAF8F5] border border-stone-200 px-2 py-0.5 rounded-lg select-all">
                                          {currentCurrency.symbol}{getScaledCost(act.estimatedCost).toLocaleString()}
                                        </span>
                                        <button
                                          onClick={() => toggleFavorite(dayPlan.day, idx)}
                                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                            isFav 
                                            ? "bg-rose-50 border-rose-200 text-rose-500 animate-pulse" 
                                            : "bg-[#FAF8F5] border-stone-200 text-stone-400 hover:text-stone-900"
                                          }`}
                                          title={isFav ? "Saved to stars dashboard!" : "Save stop"}
                                        >
                                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                                        </button>
                                      </div>
                                    </div>

                                    <p className="text-xs text-stone-500 font-light leading-relaxed">
                                      {act.description}
                                    </p>
                                  </div>

                                </div>
                              );
                            })}
                          </div>

                        </motion.div>
                      );
                    })}

                    <div className="p-3 bg-[#FAF8F4] border border-[#DECEB6] rounded-2xl flex items-start space-x-2.5 text-[11px] text-stone-500 leading-normal">
                      <Info className="w-4 h-4 text-[#D16C27] flex-shrink-0 mt-0.5" />
                      <p>
                        This schedule represents our AI's globally evaluated best route coordinates dynamically computed for a {plan.travelStyle} perspective. Use the print triggers in the top-right toolbar to download physical leaflets.
                      </p>
                    </div>

                  </div>
                )}

                {/* TAB 2: Cost Breakdown Allocations */}
                {activeTab === "budget" && (
                  <div className="p-4 md:p-6 space-y-6">
                    
                    <div className="space-y-1">
                      <h4 className="font-display font-bold text-stone-900 text-base">Interactive Allocation Gauge</h4>
                      <p className="text-xs text-stone-500 font-light">
                        Proportional budget calculations adapted instantly down to category layers based on chosen slider values.
                      </p>
                    </div>

                    {/* Cost category columns list */}
                    <div className="space-y-4">
                      {plan.estimatedBudgetBreakdown.map((item) => {
                        const scaledAmount = getScaledCost(item.amount);
                        const progressPercent = item.percentage;

                        return (
                          <div key={item.category} className="space-y-1.5 p-3.5 rounded-2xl border border-stone-100 bg-stone-50/30">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-stone-900 font-display flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${
                                  item.category === "Accommodation" ? "bg-stone-800" :
                                  item.category === "Food & Dining" ? "bg-[#D16C27]" :
                                  item.category === "Activities" ? "bg-indigo-600" :
                                  item.category === "Transport" ? "bg-amber-600" : "bg-emerald-600"
                                }`}></span>
                                <span>{item.category}</span>
                              </span>
                              <div className="font-mono text-stone-800 space-x-1.5">
                                <span className="font-bold">{currentCurrency.symbol}{scaledAmount.toLocaleString()}</span>
                                <span className="text-stone-400 text-[9.5px] bg-white border border-stone-200 px-1 py-0.2 rounded font-bold">({progressPercent}%)</span>
                              </div>
                            </div>

                            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${progressPercent}%` }}
                                className={`h-full rounded-full transition-all duration-500 ${
                                  item.category === "Accommodation" ? "bg-stone-800" :
                                  item.category === "Food & Dining" ? "bg-[#D16C27]" :
                                  item.category === "Activities" ? "bg-indigo-600" :
                                  item.category === "Transport" ? "bg-amber-600" : "bg-emerald-500"
                                }`}
                              />
                            </div>

                            <p className="text-[11px] text-stone-500 font-light mt-0.5 leading-normal pl-4">
                              {item.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Local FX Conversion section */}
                    <div className="bg-[#FAF8F4] border border-[#DECEB6] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-mono bg-[#D16C27]/10 text-[#A65B24] px-2 py-0.5 rounded font-black block">
                          Local FX Calculator Exchange rate
                        </span>
                        <h5 className="font-display font-medium text-stone-900 text-sm">
                          Dynamic Local Conversion Rate Info
                        </h5>
                        <p className="text-xs text-stone-500 font-light leading-relaxed max-w-md">
                          This plan is formulated in requested base currency <strong>{currentCurrency.code}</strong>. Local target index utilizes standard <strong>{plan.locationDetails?.currencyCode || "local token"}</strong> currency format ({plan.locationDetails?.currencySymbol || ""}).
                        </p>
                      </div>

                      <div className="bg-white px-4 py-2.5 rounded-xl border border-[#DECEB6] text-center font-mono shadow-inner min-w-[130px]">
                        <span className="text-[9px] text-stone-400 block uppercase font-bold">INDEX SCALE</span>
                        <span className="text-lg font-black text-stone-850">
                          {currentCurrency.symbol}1.00
                        </span>
                        <span className="text-[8.5px] text-stone-500 block uppercase mt-0.5">
                          {liveRate ? `${liveRate.toFixed(2)} ${plan.locationDetails?.currencyCode}` : "Matching Rates"}
                        </span>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 3: Packing checklist & cultural tips */}
                {activeTab === "concierge" && (
                  <div className="p-4 md:p-6 space-y-6">
                    
                    <div className="space-y-3 pb-3 border-b border-stone-100">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-display font-bold text-stone-900 text-base">Digital Packing Concierge</h4>
                          <p className="text-xs text-stone-500 font-light">
                            Items specifically mapped against core travel style constraints.
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#D16C27]">
                          {packingProgressPercent}% Packed
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${packingProgressPercent}%` }}
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Baggage block */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-black uppercase text-stone-400 tracking-wider block">
                          BAGGAGE CHECK INDICES
                        </span>
                        
                        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                          {plan.packingList.map((pi) => {
                            const isChecked = checkedPacking[pi.item];
                            return (
                              <button
                                key={pi.item}
                                onClick={() => togglePackingItem(pi.item)}
                                className={`w-full text-left p-2.5 rounded-xl border flex items-center space-x-3 transition-colors cursor-pointer ${
                                  isChecked 
                                  ? "bg-emerald-50/50 border-emerald-200 text-stone-400" 
                                  : "bg-[#FAF8F4]/30 border-stone-200 text-stone-850 hover:bg-stone-50"
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-stone-300 bg-white"
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <div className="space-y-0.5 leading-none">
                                  <span className={`text-xs block ${isChecked ? "line-through text-stone-400" : ""}`}>
                                    {pi.item}
                                  </span>
                                  <span className="text-[8px] font-mono text-stone-400 bg-stone-100 px-1 py-0.1 tracking-wide uppercase rounded font-bold">
                                    {pi.category}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Customs guidelines */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black uppercase text-stone-400 tracking-wider block">
                          LOCAL CODE PROTOCOLS
                        </span>
                        
                        <div className="space-y-3">
                          {plan.travelTips.map((tip) => (
                            <div key={tip.title} className="p-3.5 bg-[#FAF8F4]/40 border border-[#EBE6DC] rounded-xl space-y-1">
                              <div className="flex items-center space-x-1.5 pb-1 border-b border-[#FAF1E3]/20">
                                <span className={`w-1.8 h-1.8 rounded-full ${
                                  tip.category === "Safety" ? "bg-red-500 animate-pulse" :
                                  tip.category === "Culture" ? "bg-purple-500" : "bg-amber-500"
                                }`}></span>
                                <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest">{tip.category}</span>
                              </div>
                              <h6 className="font-display font-semibold text-xs text-stone-900 pt-1">
                                {tip.title}
                              </h6>
                              <p className="text-[10.5px] text-stone-500 font-light leading-relaxed">
                                {tip.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>
                )}

                {/* TAB 4: API Gateway Prepared Sandbox diagnostics */}
                {activeTab === "architecture" && (
                  <div className="p-4 md:p-6 space-y-6">
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-5 h-5 text-[#D16C27]" />
                        <h4 className="font-display font-bold text-stone-900 text-base">API Integration Preparedness Gateway</h4>
                      </div>
                      <p className="text-xs text-stone-500 font-light leading-relaxed">
                        This environment has been pre-configured and tested with beautiful backend routing. Direct service hooks are pre-loaded to scale exchange indices, weather kits, events, and roads without clutter.
                      </p>
                    </div>

                    {/* Diagnostics Terminals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Weather API Sandbox Connection */}
                      <div className="bg-stone-950 text-[#9ED858] font-mono text-[10.5px] p-4 rounded-xl border border-stone-850 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                          <span className="text-stone-400 font-bold">☁️ OpenWeather Gateway</span>
                          <span className="bg-[#41621E]/30 text-[#A9FF4F] px-1.5 py-0.2 rounded text-[8px] animate-pulse">ACTIVE GATEWAY stub</span>
                        </div>
                        <p>QUERY PATH: <span className="text-white">GET /weather?lat={plan.locationDetails?.lat.toFixed(4) || "0.0"}&lng={plan.locationDetails?.lng.toFixed(4) || "0.0"}</span></p>
                        <p>RESPONSE STATUS: <span className="text-white">200 Ready</span></p>
                        <p>SIM WEATHER PROV: <span className="text-[#A9FF4F]">{weatherData?.condition || "Mild Haze"} ({weatherData?.currentTemp || "18"}°C)</span></p>
                      </div>

                      {/* Foreign Exchange Rates Connection */}
                      <div className="bg-stone-950 text-[#E7A531] font-mono text-[10.5px] p-4 rounded-xl border border-stone-850 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                          <span className="text-stone-400 font-bold">👛 ExchangeRates Portal</span>
                          <span className="bg-[#5C3F10]/30 text-[#FFAE2B] px-1.5 py-0.2 rounded text-[8px]">ACTIVE GATEWAY stub</span>
                        </div>
                        <p>CONVERT PAIR: <span className="text-white">{preferences.baseCurrency} / {plan.currency.code}</span></p>
                        <p>RATE INDEX VALUE: <span className="text-white">{liveRate ? liveRate.toFixed(4) : "Calculating..."}</span></p>
                        <p>SYNC INTERVAL: <span className="text-[#FFAE2B]">Live Conversion Simulator Active</span></p>
                      </div>

                      {/* Metropolitan Traffic Sensor Connection */}
                      <div className="bg-stone-950 text-[#30ACFC] font-mono text-[10.5px] p-4 rounded-xl border border-stone-850 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                          <span className="text-stone-400 font-bold">🚗 Google Maps Traffic</span>
                          <span className="bg-[#0F5A8F]/30 text-[#54CCFF] px-1.5 py-0.2 rounded text-[8px]">ACTIVE GATEWAY stub</span>
                        </div>
                        <p>ROAD RADAR AREA: <span className="text-white">{plan.locationDetails?.city || "Paris"}, {plan.locationDetails?.country || "France"}</span></p>
                        <p>TELEMETRY DETECTED: <span className="text-white">{liveTrafficStatus || "CLEAR ROUTING"}</span></p>
                        <p>STATUS STABILIZER: <span className="text-[#54CCFF]">Ready for secure traffic SDK bound</span></p>
                      </div>

                      {/* Cultural Events Tickmaster Connection */}
                      <div className="bg-stone-950 text-[#C15FF1] font-mono text-[10.5px] p-4 rounded-xl border border-stone-850 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5">
                          <span className="text-stone-400 font-bold">🎟️ Ticketmaster Events</span>
                          <span className="bg-[#4E106E]/30 text-[#D78BFF] px-1.5 py-0.2 rounded text-[8px]">ACTIVE GATEWAY stub</span>
                        </div>
                        <p>SEARCH FILTER: <span className="text-white">Style: {plan.travelStyle} in {plan.locationDetails?.city || "Paris"}</span></p>
                        <p>RESULTS FOUND: <span className="text-white">{liveEventsList.length} items logged</span></p>
                        <p>DIAG STATUS: <span className="text-[#D78BFF]">Integration socket verified</span></p>
                      </div>

                    </div>

                    {/* Simulated Events visual display */}
                    <div className="p-4 bg-[#FAF8F4] border border-[#DECEB6] rounded-2xl space-y-3">
                      <h5 className="font-display font-semibold text-xs text-stone-900 flex items-center space-x-1.5">
                        <Activity className="w-4 h-4 text-[#D16C27]" />
                        <span>Mock Events Feed (Direct JSON Interface)</span>
                      </h5>
                      <div className="space-y-2">
                        {liveEventsList.map((evt, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-stone-200 text-xs flex justify-between items-center">
                            <div>
                              <p className="font-bold text-stone-800 leading-tight">{evt.title}</p>
                              <p className="text-[10px] text-stone-400 mt-1">📍 {evt.venue} ({evt.date})</p>
                            </div>
                            <span className="text-[9.5px] bg-[#FAF1E3] text-[#A65B24] font-mono px-2 py-0.5 rounded uppercase font-bold">
                              {evt.category}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </main>

      {/* 6. USER CONFIGURABLE PREFERENCES SIDEBAR SLEEK PANEL */}
      <AnimatePresence>
        {isPrefOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrefOpen(false)}
              className="absolute inset-0 bg-stone-900"
            />

            {/* Panel slider container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 185 }}
              className="relative w-full max-w-sm h-full bg-white border-l border-[#EBE6DC] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-[#D16C27]" />
                    <h3 className="font-display font-bold text-base text-stone-900">User Preference Profile</h3>
                  </div>
                  <button onClick={() => setIsPrefOpen(false)} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-800 transition-colors cursor-pointer">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  Enter your local credentials profile below. Dynamic budgets, time calculations, languages, and FX indicators configure automatically.
                </p>

                {/* Preference inputs form */}
                <div className="space-y-4">
                  
                  {/* Home country selection */}
                  <div className="space-y-1.5">
                    <label id="home-country-label" className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400 block">
                      Home Country / Residence
                    </label>
                    <select
                      value={preferences.homeCountry}
                      onChange={(e) => setPreferences({ ...preferences, homeCountry: e.target.value })}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2.5 font-medium text-stone-805 leading-none cursor-pointer"
                      aria-labelledby="home-country-label"
                    >
                      {["United States", "India", "Germany", "United Kingdom", "United Arab Emirates", "Singapore", "Canada", "Australia", "Japan"].map((ctr) => (
                        <option key={ctr} value={ctr}>{ctr}</option>
                      ))}
                    </select>
                  </div>

                  {/* Primary currency selection */}
                  <div className="space-y-1.5">
                    <label id="base-currency-label" className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400 block">
                      Default Preferred Base Currency
                    </label>
                    <select
                      value={preferences.baseCurrency}
                      onChange={(e) => setPreferences({ ...preferences, baseCurrency: e.target.value })}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2.5 font-medium text-stone-805 leading-none cursor-pointer"
                      aria-labelledby="base-currency-label"
                    >
                      {["USD", "INR", "EUR", "GBP", "AED", "SGD", "JPY", "CAD", "AUD"].map((cur) => (
                        <option key={cur} value={cur}>{cur} - Standard Currency</option>
                      ))}
                    </select>
                  </div>

                  {/* Language selection */}
                  <div className="space-y-1.5">
                    <label id="pref-language-label" className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400 block">
                      Preferred Language Standard
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2.5 font-medium text-stone-850 leading-none cursor-pointer"
                      aria-labelledby="pref-language-label"
                    >
                      {["English", "French", "Spanish", "Hindi", "Arabic", "German"].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  {/* Standard local timezone */}
                  <div className="space-y-1.5">
                    <label id="pref-timezone-label" className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400 block">
                      Home Timezone Code / Offset
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full text-xs bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2.5 font-medium text-stone-850 leading-none cursor-pointer"
                      aria-labelledby="pref-timezone-label"
                    >
                      {["GMT/UTC", "EST", "IST", "CET", "GST", "SGT", "JST", "PST"].map((tz) => (
                        <option key={tz} value={tz}>{tz} offset zone</option>
                      ))}
                    </select>
                  </div>

                </div>

              </div>

              {/* Preferences bottom notice */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <button
                  onClick={() => setIsPrefOpen(false)}
                  className="w-full bg-[#D16C27] hover:bg-[#B35215] text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer transition-colors text-center block"
                >
                  Save & Apply Settings
                </button>
                <p className="text-[9.5px] text-stone-400 text-center font-light leading-normal">
                  Preferences persist securely inside your local sandbox container storage and automatically inject on generation.
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. DYNAMIC MAP PIN DIRECTORY DRAWER (ADD/EDIT DIALOG PANEL) */}
      <AnimatePresence>
        {isAddingCustomDest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingCustomDest(false)}
              className="absolute inset-0 bg-stone-900"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-white rounded-3xl border border-[#EBE6DC] shadow-2xl overflow-hidden z-10 p-6 space-y-4"
            >
              
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-5 h-5 text-[#D16C27]" />
                  <h3 className="font-display font-medium text-stone-900 text-base">
                    {editingDestId ? "Edit Configured Destination" : "Configure Custom Destination"}
                  </h3>
                </div>
                <button onClick={() => setIsAddingCustomDest(false)} className="text-stone-400 hover:text-stone-850 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveCustomDestination} className="space-y-4 text-xs font-medium text-stone-600">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  <div className="space-y-1">
                    <label id="dest-label-name" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 leading-none block">
                      Target Label Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kyoto Traditional Haveli"
                      value={newDestForm.name}
                      onChange={(e) => setNewDestForm({ ...newDestForm, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850"
                      required
                      aria-labelledby="dest-label-name"
                    />
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-city" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 leading-none block">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kyoto"
                      value={newDestForm.city}
                      onChange={(e) => setNewDestForm({ ...newDestForm, city: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850"
                      required
                      aria-labelledby="dest-label-city"
                    />
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-country" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 leading-none block">
                      Country *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Japan"
                      value={newDestForm.country}
                      onChange={(e) => setNewDestForm({ ...newDestForm, country: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850"
                      required
                      aria-labelledby="dest-label-country"
                    />
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-timezone" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 leading-none block">
                      Standard Timezone *
                    </label>
                    <select
                      value={newDestForm.timezone}
                      onChange={(e) => setNewDestForm({ ...newDestForm, timezone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850 cursor-pointer"
                      aria-labelledby="dest-label-timezone"
                    >
                      {["GMT", "EST", "IST", "CET", "GST", "SGT", "JST", "PST"].map(tz => (
                        <option key={tz} value={tz}>{tz} Standard</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-currencyCode" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 leading-none block">
                      Currency Code *
                    </label>
                    <select
                      value={newDestForm.currencyCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const sym = code === "EUR" ? "€" :
                                    code === "INR" ? "₹" :
                                    code === "GBP" ? "£" :
                                    code === "AED" ? "د.إ" :
                                    code === "SGD" ? "S$" :
                                    code === "JPY" ? "¥" : "$";
                        setNewDestForm({ ...newDestForm, currencyCode: code, currencySymbol: sym });
                      }}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850 cursor-pointer"
                      aria-labelledby="dest-label-currencyCode"
                    >
                      {["USD", "INR", "EUR", "GBP", "AED", "SGD", "JPY", "CAD", "AUD"].map(cur => (
                        <option key={cur} value={cur}>{cur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-lat" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                      Latitude Coordinate
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 35.0"
                      value={newDestForm.lat}
                      onChange={(e) => setNewDestForm({ ...newDestForm, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850 font-mono"
                      aria-labelledby="dest-label-lat"
                    />
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-lng" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                      Longitude Coordinate
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      placeholder="e.g. 135.0"
                      value={newDestForm.lng}
                      onChange={(e) => setNewDestForm({ ...newDestForm, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850 font-mono"
                      aria-labelledby="dest-label-lng"
                    />
                  </div>

                  <div className="space-y-1">
                    <label id="dest-label-tag" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                      Category Tag
                    </label>
                    <select
                      onChange={(e) => setNewDestForm({ ...newDestForm, tags: [e.target.value] })}
                      className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850 cursor-pointer"
                      aria-labelledby="dest-label-tag"
                    >
                      {["Culture", "Boutique", "Coastline", "Museums", "Adventure", "Modern"].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="space-y-1">
                  <label id="dest-label-description" className="text-[9.5px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                    Description & Highlight Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short summary highlighting scenic sites, hotels, or cafes..."
                    value={newDestForm.description}
                    onChange={(e) => setNewDestForm({ ...newDestForm, description: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#DECEB6] rounded-xl px-3 py-2 text-stone-850"
                    aria-labelledby="dest-label-description"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomDest(false)}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#D16C27] hover:bg-[#B35215] text-white font-semibold px-5 py-2 rounded-xl cursor-pointer"
                  >
                    {editingDestId ? "Save Modifications" : "Save Destination"}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. PRINT ONLY WORKSHEET COMPONENT (Aesthetic, strictly hidden from main UI viewport) */}
      {plan && (
        <div className="hidden print:block p-8 space-y-8 font-serif" id="print-view-only">
          <div className="border-b-2 border-stone-800 pb-4">
            <h1 className="text-3xl font-bold flex items-center justify-between">
              <span>{plan.destination} Tour Guide</span>
              <span className="text-base font-mono font-light text-stone-550">TravelGenie</span>
            </h1>
            <p className="text-stone-500 uppercase font-mono text-xs tracking-wider pt-1">{plan.travelStyle} Custom Day-by-Day Itinerary</p>
            <p className="text-sm font-medium">Selected Budget Allocation: {currentCurrency.symbol}{adjustedBudget.toLocaleString()} {currentCurrency.code}</p>
          </div>

          <div className="space-y-6">
            {plan.itinerary.map(dayPlan => (
              <div key={dayPlan.day} className="space-y-3">
                <h3 className="text-xl font-bold border-b border-stone-400 pb-1">Day {dayPlan.day}: {dayPlan.title}</h3>
                <div className="pl-4 space-y-3">
                  {dayPlan.activities.map((act, ai) => (
                    <div key={ai} className="text-xs">
                      <span className="font-bold">[{act.timeOfDay}] {act.title}</span> at <span className="underline">{act.locationName}</span> ({currentCurrency.symbol}{Math.round(act.estimatedCost * (adjustedBudget / plan.budget))})
                      <p className="text-stone-605 font-sans italic pt-0.5">{act.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-stone-800 pt-4 text-center text-xs">
            <p>Travel Plan generated and compiled dynamically by TravelGenie globally scalable agency engine.</p>
          </div>
        </div>
      )}

      {/* 9. AESTHETIC FOOTER BLOCK */}
      <footer className="border-t border-[#EBE6DC] py-6 px-4 bg-[#FAF8F4] text-center text-xs font-light text-stone-400 print:hidden mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-wider">TravelGenie Portal Workspace © 2026</p>
          <div className="flex items-center space-x-4 text-[10.5px]">
            <span>Self-contained Single-page layout</span>
            <span>•</span>
            <span>Prepared AI Integration Sandbox</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
