/**
 * Shared Type Definitions for TravelGenie Global Travel Planning Platform
 */

export interface LocationDetails {
  country: string;
  city: string;
  timezone: string;
  currencyCode: string;
  currencySymbol: string;
  lat: number;
  lng: number;
}

export interface UserPreferences {
  homeCountry: string;
  baseCurrency: string; // e.g. "USD", "INR", "EUR", "GBP", "AED", "SGD", "JPY"
  language: string;
  timezone: string;
}

export interface ManagedDestination {
  id: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  currencyCode: string;
  currencySymbol: string;
  lat: number;
  lng: number;
  tags: string[];
  description: string;
}

export interface TravelPlannerInputs {
  destination: string;
  budget: number;
  days: number;
  travelStyle: string;
  constraints: string;
  preferredCurrency?: string; // Currency selected by the planning context
}

export interface Activity {
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  title: string;
  description: string;
  locationName: string;
  estimatedCost: number;
  iconType: "beach" | "utensils" | "bike" | "landmark" | "coffee" | "moon" | "shopping" | "tree" | "bus" | "walk";
}

export interface DailyItinerary {
  day: number;
  title: string;
  activities: Activity[];
  dayCost: number;
}

export interface BudgetCategory {
  category: "Accommodation" | "Food & Dining" | "Activities" | "Transport" | "Miscellaneous";
  amount: number;
  percentage: number;
  description: string;
}

export interface TravelTip {
  category: "Culture" | "Safety" | "Transport" | "Local Food" | "General";
  title: string;
  content: string;
}

export interface PackingItem {
  item: string;
  category: "Essentials" | "Clothing" | "Electronics" | "Toiletries" | "Other";
}

export interface CurrencyDetails {
  code: string;
  symbol: string;
}

export interface TravelPlanResponse {
  destination: string;
  budget: number;
  days: number;
  travelStyle: string;
  currency: CurrencyDetails;
  totalEstimatedCost: number;
  estimatedBudgetBreakdown: BudgetCategory[];
  itinerary: DailyItinerary[];
  travelTips: TravelTip[];
  packingList: PackingItem[];
  locationDetails?: LocationDetails;
}
