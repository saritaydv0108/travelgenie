/**
 * Simulated Localized Weather Forecast API for TravelGenie
 */

export interface DailyWeather {
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: "sun" | "cloud" | "cloud-rain" | "cloud-lightning" | "cloud-snow" | "sunset";
}

export interface WeatherForecast {
  currentTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  statusText: string;
  seasonalTip: string;
  bestGear: string[];
  forecast: DailyWeather[];
}

export function getSimulatedWeather(destination: string): WeatherForecast {
  const destLower = destination.toLowerCase();

  // 1. Heritage Indian Destinations
  if (destLower.includes("india") || destLower.includes("jaipur") || destLower.includes("delhi") || destLower.includes("agra") || destLower.includes("kerala") || destLower.includes("mumbai") || destLower.includes("goa") || destLower.includes("rajasthan")) {
    const isSouth = destLower.includes("kerala") || destLower.includes("goa") || destLower.includes("mumbai");
    return {
      currentTemp: isSouth ? 31 : 36,
      condition: isSouth ? "Humid & Tropical Breeze" : "Warm Sun & Royal Skies",
      humidity: isSouth ? 82 : 45,
      windSpeed: 14,
      uvIndex: 9,
      statusText: isSouth ? "Warm monsoon-ready humidity. Perfect for coconut water refreshers." : "High UV levels. Carry your parasol and stay fully hydrated with spiked nimbu paani.",
      seasonalTip: "Indian travel etiquette demands comfortable, light, loose linen cottons that fully cover shoulders and knees.",
      bestGear: ["Broad-brim cotton hat", "Linen travel trousers", "Reusable stainless steel hydration bottle", "Mosquito defense mist"],
      forecast: [
        { dayName: "Today", tempMax: isSouth ? 32 : 37, tempMin: isSouth ? 25 : 24, condition: isSouth ? "Tropic Sun" : "Sizzling", icon: "sun" },
        { dayName: "Tomorrow", tempMax: isSouth ? 30 : 36, tempMin: isSouth ? 24 : 23, condition: isSouth ? "Dusk Showers" : "Clear Sky", icon: "sunset" },
        { dayName: "Day after", tempMax: isSouth ? 31 : 35, tempMin: isSouth ? 25 : 22, condition: isSouth ? "Overcast Humid" : "Sunny Haze", icon: "cloud-rain" }
      ]
    };
  }

  // 2. Mediterranean Coastal Destinations (Italy, Amalfi, Greece, Dubai)
  if (destLower.includes("italy") || destLower.includes("amalfi") || destLower.includes("positano") || destLower.includes("rome") || destLower.includes("greece") || destLower.includes("dubai") || destLower.includes("aed")) {
    return {
      currentTemp: 25,
      condition: "Clear Mediterranean Sunshine",
      humidity: 48,
      windSpeed: 16,
      uvIndex: 8,
      statusText: "Glorious onshore coastal breezes. Ideal yacht and ferry sailing conditions.",
      seasonalTip: "Expect high warmth during afternoons. Local cafes shut down between 2:00 PM and 5:00 PM for riposo.",
      bestGear: ["Polarized yacht sunglasses", "Light linen chemise", "Slip-resistant boat shoes", "Hydrating sunscreen"],
      forecast: [
        { dayName: "Today", tempMax: 26, tempMin: 18, condition: "Sunny skies", icon: "sun" },
        { dayName: "Tomorrow", tempMax: 25, tempMin: 17, condition: "Breezy blue", icon: "sunset" },
        { dayName: "Day after", tempMax: 24, tempMin: 16, condition: "Fluffy clouds", icon: "cloud" }
      ]
    };
  }

  // 3. Temperate Western & Central European Destinations (Paris, London, New York)
  if (destLower.includes("france") || destLower.includes("paris") || destLower.includes("london") || destLower.includes("uk") || destLower.includes("europe") || destLower.includes("new york") || destLower.includes("america") || destLower.includes("usa")) {
    return {
      currentTemp: 18,
      condition: "Pleasant Clear Spring Breeze",
      humidity: 55,
      windSpeed: 11,
      uvIndex: 5,
      statusText: "Optimal conditions for boulevard exploration, museum visits, and local garden strolls.",
      seasonalTip: "Expect a sudden drop in temperature after sunset. carry a light layered jacket for night walks or riverside cruises.",
      bestGear: ["Light travel windbreaker", "Comfortable walking shoes", "Compact folding umbrella", "Day pack"],
      forecast: [
        { dayName: "Today", tempMax: 20, tempMin: 11, condition: "Blue skies", icon: "sun" },
        { dayName: "Tomorrow", tempMax: 17, tempMin: 12, condition: "Partly cloudy", icon: "cloud" },
        { dayName: "Day after", tempMax: 15, tempMin: 10, condition: "Passing drizzle", icon: "cloud-rain" }
      ]
    };
  }

  // 4. Default simulated weather for custom user entries
  return {
    currentTemp: 21,
    condition: "Partly Cloudy & Cozy Skies",
    humidity: 58,
    windSpeed: 12,
    uvIndex: 6,
    statusText: "Temperate travel conditions. Excellent for general sightseeing tours.",
    seasonalTip: "Always review local custom directives and keep a light protective raincoat handy just in case.",
    bestGear: ["Light comfortable walking shoes", "Sunglasses", "Reusable water tumbler", "Compact dry pack"],
    forecast: [
      { dayName: "Today", tempMax: 23, tempMin: 15, condition: "Sunny intervals", icon: "sun" },
      { dayName: "Tomorrow", tempMax: 22, tempMin: 14, condition: "Mild breeze", icon: "cloud" },
      { dayName: "Day after", tempMax: 21, tempMin: 13, condition: "Overcast skies", icon: "cloud" }
    ]
  };
}
