import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Lazy initialize Gemini client to prevent startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("MY_KEY")) {
      throw new Error("GEMINI_API_KEY is not configured. Please add your key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      apiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY")
    });
  });

  // TravelGenie AI Planner endpoint
  app.post("/api/plan-trip", async (req, res) => {
    try {
      const { destination, budget, days, travelStyle, constraints, preferredCurrency } = req.body;

      if (!destination || !budget || !days || !travelStyle) {
        return res.status(400).json({
          error: "Missing fields",
          message: "Please fill in all standard inputs: destination, budget, days, and travel style."
        });
      }

      // Check key and fetch AI client lazily
      let ai;
      try {
        ai = getAiClient();
      } catch (err: any) {
        console.error("Gemini initialization error:", err.message);
        return res.status(401).json({
          error: "Config Error",
          message: err.message || "Your GEMINI_API_KEY is missing. Please add it in the Secrets panel."
        });
      }

      // Default the client preferred currency to USD if not specified
      const targetCurrencyCode = preferredCurrency || "USD";

      const prompt = `
        You are a world-class travel planner concierge and expert tour curator named TravelGenie.
        Design a highly realistic, culturally rich, and completely optimized travel plan for:
        - Destination Name: ${destination}
        - Total Target Budget: ${budget} (Expressed in currency ${targetCurrencyCode})
        - Travel Duration: ${days} days
        - Core Travel Style: ${travelStyle}
        - Personal Constraints / Preferences: ${constraints || "None provided"}

        Guidelines:
        1. Customize the itinerary to the style "${travelStyle}". For example, "Cultural" should include historic locations; "Relaxed" should feature leisure paces; "Family" covers child-friendly spots.
        2. Adjust for any custom personal preferences (e.g. if vegetarian, highlight local top-rated veggie dining; if wheel-chair accessibility, make locations physical-friendly).
        3. Allocate the entire ${budget} budget in ${targetCurrencyCode} across Accommodation, Food & Dining, Activities, Transport, and Miscellaneous. Ensure the sums add up approximately to the budget of ${budget} ${targetCurrencyCode}.
        4. Day-by-day Itinerary: Generate exactly ${days} distinct days. Each day features unique local name tags and exactly 3 activities (Morning, Afternoon, Evening) with realistic costs in ${targetCurrencyCode}.
        5. Map out locationDetails: Dynamically research the destination's real country, city, standard timezone, local country currency, and realistic coordinates (latitude & longitude).
        6. Provide travel tips in the returned schema covering Culture, Safety, Transport, and Local Food, tailored to the destination.
        7. Provide a packing list of customized gear suitable for the local weather and style of destination.
      `;

      console.log(`Generating plan for ${destination} in currency ${targetCurrencyCode} (${days} days)...`);

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are the core service API of the TravelGenie platform. You must return perfectly valid JSON conforming strictly to the requested schema. Ensure all costs, budgets, and amounts are reasonable estimations calculated in the requested currency (${targetCurrencyCode}). Do not wrap inside markdown blocks or add raw text.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            required: [
              "destination",
              "budget",
              "days",
              "travelStyle",
              "currency",
              "totalEstimatedCost",
              "estimatedBudgetBreakdown",
              "itinerary",
              "travelTips",
              "packingList",
              "locationDetails"
            ],
            properties: {
              destination: {
                type: Type.STRING,
                description: "The formatted name of the destination (e.g., Kyoto, Japan or Paris, France)."
              },
              budget: {
                type: Type.NUMBER,
                description: "The target budget requested by the user in the selected currency."
              },
              days: {
                type: Type.INTEGER,
                description: "The number of days for the trip."
              },
              travelStyle: {
                type: Type.STRING,
                description: "The selected travel style."
              },
              currency: {
                type: Type.OBJECT,
                required: ["code", "symbol"],
                properties: {
                  code: { type: Type.STRING, description: "The currency code, matching the requested preferred currency (e.g., USD, INR, EUR, GBP, AED, SGD, JPY)." },
                  symbol: { type: Type.STRING, description: "The currency symbol corresponding to the code (e.g., $, ₹, €, £, د.إ, S$, ¥)." }
                }
              },
              totalEstimatedCost: {
                type: Type.NUMBER,
                description: "Sum of all estimated expenses across categories, in the selected currency."
              },
              estimatedBudgetBreakdown: {
                type: Type.ARRAY,
                description: "Intelligent breakdown of costs into 5 core category buckets adding up to the total budget.",
                items: {
                  type: Type.OBJECT,
                  required: ["category", "amount", "percentage", "description"],
                  properties: {
                    category: { 
                      type: Type.STRING, 
                      enum: ["Accommodation", "Food & Dining", "Activities", "Transport", "Miscellaneous"],
                      description: "The budget bucket category."
                    },
                    amount: { type: Type.NUMBER, description: "Allocated amount in the requested currency." },
                    percentage: { type: Type.NUMBER, description: "Percentage of total budget allocated (e.g. 35 for 35%)." },
                    description: { type: Type.STRING, description: "A detail of what this category covers under this budget level." }
                  }
                }
              },
              itinerary: {
                type: Type.ARRAY,
                description: "Full day-by-day plan of activities.",
                items: {
                  type: Type.OBJECT,
                  required: ["day", "title", "activities", "dayCost"],
                  properties: {
                    day: { type: Type.INTEGER, description: "Day number (starting from 1)." },
                    title: { type: Type.STRING, description: "A theme or title for this specific day." },
                    dayCost: { type: Type.NUMBER, description: "Estimated total cost of activities for this day in the requested currency." },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        required: ["timeOfDay", "title", "description", "locationName", "estimatedCost", "iconType"],
                        properties: {
                          timeOfDay: { type: Type.STRING, enum: ["Morning", "Afternoon", "Evening"] },
                          title: { type: Type.STRING, description: "Short descriptive title of the activity." },
                          description: { type: Type.STRING, description: "Immersive description of the experience, specific to the true local details." },
                          locationName: { type: Type.STRING, description: "Exact place name or neighborhood to visit." },
                          estimatedCost: { type: Type.NUMBER, description: "Estimated activity cost in the requested currency." },
                          iconType: { 
                            type: Type.STRING, 
                            enum: ["beach", "utensils", "bike", "landmark", "coffee", "moon", "shopping", "tree", "bus", "walk"],
                            description: "Visual icon classification representing the activity."
                          }
                        }
                      }
                    }
                  }
                }
              },
              travelTips: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["category", "title", "content"],
                  properties: {
                    category: { type: Type.STRING, enum: ["Culture", "Safety", "Transport", "Local Food", "General"] },
                    title: { type: Type.STRING, description: "Short title of the tip." },
                    content: { type: Type.STRING, description: "The specific local advice or cultural advice." }
                  }
                }
              },
              packingList: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["item", "category"],
                  properties: {
                    item: { type: Type.STRING, description: "Name of the packed item." },
                    category: { type: Type.STRING, enum: ["Essentials", "Clothing", "Electronics", "Toiletries", "Other"] }
                  }
                }
              },
              locationDetails: {
                type: Type.OBJECT,
                required: ["country", "city", "timezone", "currencyCode", "currencySymbol", "lat", "lng"],
                properties: {
                  country: { type: Type.STRING, description: "Actual country of the destination." },
                  city: { type: Type.STRING, description: "Primary city or scenic region name." },
                  timezone: { type: Type.STRING, description: "Relevant primary timezone (e.g., GMT, EST, IST, CET, GST, JST, SGT)." },
                  currencyCode: { type: Type.STRING, description: "Local currency code used at destination." },
                  currencySymbol: { type: Type.STRING, description: "Local currency symbol used at destination." },
                  lat: { type: Type.NUMBER, description: "Latitude coordinate of destination." },
                  lng: { type: Type.NUMBER, description: "Longitude coordinate of destination." }
                }
              }
            }
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini model.");
      }

      const planData = JSON.parse(responseText.trim());
      res.json(planData);
    } catch (error: any) {
      console.error("Error designing travel plan:", error);
      res.status(500).json({
        error: "Generation Failed",
        message: error.message || "Something went wrong while curating your travel itinerary. Please try again."
      });
    }
  });

  // Integrate Vite Dev Server Middleware or Static Production Build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TravelGenie Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
