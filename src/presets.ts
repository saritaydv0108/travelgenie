import { TravelPlanResponse } from "./types";

export interface TravelPreset {
  name: string;
  destination: string;
  budget: number;
  days: number;
  travelStyle: string;
  constraints: string;
  badge: string;
  demoData: TravelPlanResponse;
}

export const TRAVEL_PRESETS: TravelPreset[] = [
  {
    name: "Rajasthan Heritage & Taj Mahal",
    destination: "Jaipur, Agra, & Delhi, India",
    budget: 1800,
    days: 5,
    travelStyle: "Cultural",
    constraints: "Pure vegetarian organic meals, private car transfers, local clay-pot workshops.",
    badge: "🏰 Indian Heritage",
    demoData: {
      destination: "Delhi, Agra & Jaipur, India",
      budget: 1800,
      days: 5,
      travelStyle: "Cultural",
      currency: { code: "INR", symbol: "₹" },
      totalEstimatedCost: 1720,
      estimatedBudgetBreakdown: [
        { category: "Accommodation", amount: 680, percentage: 38, description: "Boutique heritage Haveli hotel with arches in Jaipur and a garden-view resort overlooking Agra." },
        { category: "Food & Dining", amount: 360, percentage: 20, description: "Authentic Rajasthani thalis, heritage royal durbars, and organic farm-to-table saffron lassi." },
        { category: "Activities", amount: 280, percentage: 15, description: "VIP fast-track Taj Mahal entry, Amber Fort Jeep ascents, blue pottery workshop, and live Sufi music." },
        { category: "Transport", amount: 300, percentage: 17, description: "Private air-conditioned chauffeur ambassador sedan for all inter-city highway highway loops." },
        { category: "Miscellaneous", amount: 100, percentage: 10, description: "Traditional printed block linens, miniature paintings support, and regional tips." }
      ],
      itinerary: [
        {
          day: 1,
          title: "Imperial Delhi Minarets & Spiced Chais",
          dayCost: 290,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Humayun's Mughal Garden-Tomb",
              description: "Walk inside the red sandstone precursor to the Taj, appreciating symmetric gardens with a certified historian.",
              locationName: "Humayun's Tomb, New Delhi",
              estimatedCost: 25,
              iconType: "landmark"
            },
            {
              timeOfDay: "Afternoon",
              title: "Old Delhi Rickshaw Bazaar & Cutting-Chai",
              description: "Ride an authentic tricycle through Chandni Chowk's spice alleys, sampling piping hot jalebis and clay-pot tea.",
              locationName: "Khari Baoli & Chandni Chowk, Delhi",
              estimatedCost: 15,
              iconType: "walk"
            },
            {
              timeOfDay: "Evening",
              title: "Sufi Devotional Qawwalis at Nizamuddin",
              description: "Listen to mystical acoustic drums and passionate vocals soaring inside Nizamuddin's flower-scented courtyard.",
              locationName: "Hazrat Nizamuddin Dargah, Delhi",
              estimatedCost: 20,
              iconType: "moon"
            }
          ]
        },
        {
          day: 2,
          title: "The Love Epiphany — Taj Sunrise Marvel",
          dayCost: 340,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Taj Mahal Sunrise Mystique",
              description: "Watch translucent white Makrana marble bloom under the earliest rays of the Yamuna morning sun.",
              locationName: "Taj Mahal Complex, Agra",
              estimatedCost: 45,
              iconType: "landmark"
            },
            {
              timeOfDay: "Afternoon",
              title: "Red Imperial Citadel Tour",
              description: "Explore Emperor Shah Jahan's palace halls where he gazed longingly at the Taj.",
              locationName: "Agra Fort, Uttar Pradesh",
              estimatedCost: 20,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Clay-pot Petha and Saffron Lassi",
              description: "Savor Agra's sweet candied gourd paired with thick whipped cardamom lassi in local bazaar markets.",
              locationName: "Sadar Bazaar Old Alleys, Agra",
              estimatedCost: 12,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 3,
          title: "Into the Pink City — Rajput Fortresses",
          dayCost: 380,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Drive to Jaipur via Abhaneri Stepwells",
              description: "Journey through Rajasthani countryside, making a custom stop at India's largest featured geometric stepwell maze.",
              locationName: "Chand Baori Stepwell, Abhaneri",
              estimatedCost: 35,
              iconType: "bus"
            },
            {
              timeOfDay: "Afternoon",
              title: "Hawa Mahal Window & Jaipur Palace Heritage",
              description: "Photograph the honeycomb pink facade of the Breeze Palace, then walk through royal private armories.",
              locationName: "Jaipur City Palace & Hawa Mahal",
              estimatedCost: 25,
              iconType: "shopping"
            },
            {
              timeOfDay: "Evening",
              title: "Daal Baati Royal Rajasthani Thali Feast",
              description: "Feast on slow-roasted hand-rolled wheat balls drenched in spiced organic ghee and lentil curries during traditional dances.",
              locationName: "Chokhi Dhani Traditional Village, Jaipur",
              estimatedCost: 40,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 4,
          title: "Amber Hill Forts & Indigo Blue Pottery",
          dayCost: 320,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Amber Palace Mirror-Hall Ascent",
              description: "Ride an eco-friendly open jeep up Amber Ridge, walking through the incredible Hall of Mirrors that sparkles with a single Match.",
              locationName: "Amber Fort, Jaipur Peaks",
              estimatedCost: 30,
              iconType: "bike"
            },
            {
              timeOfDay: "Afternoon",
              title: "Indigo Block-Printing & Blue Clay Workshop",
              description: "Press custom indigo dye designs onto raw regional cotton sheets, and spin delicate turquoise blue Jaipur clay pots.",
              locationName: "Anokhi Hand Crafts Museum & Workshops",
              estimatedCost: 50,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Sunset over Jal Mahal Lake View",
              description: "Bask in quiet pastel dusk views of the floating water-palace while sipping fresh cardamon tea by the historic lake path.",
              locationName: "Man Sagar Lake Scenic Promenade, Jaipur",
              estimatedCost: 10,
              iconType: "tree"
            }
          ]
        },
        {
          day: 5,
          title: "Galta Monkeys & Jaipur Bazaar Treasures",
          dayCost: 390,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Galtaji Sacred Valley Sun Temple",
              description: "Ascend a calm mountain cleft famous for sacred mineral water pools and friendly wild macaque monkeys.",
              locationName: "Galta Monkey Temple, Aravalli Hills",
              estimatedCost: 15,
              iconType: "tree"
            },
            {
              timeOfDay: "Afternoon",
              title: "Artisanal Carpet and Gemstone Crafting",
              description: "Observe veteran master-weavers knotting floral rugs, and study Jaipur's world-famous emerald and ruby hand-cutting guilds.",
              locationName: "Johari Jaipur Bazaars",
              estimatedCost: 80,
              iconType: "shopping"
            },
            {
              timeOfDay: "Evening",
              title: "Grand Rajput Farewell Dinner",
              description: "Toast a spectacular voyage with local spiced dry curries and saffron pudding at a heritage mansion under the Jaipur sky.",
              locationName: "LMB Heritage Hall, Jaipur",
              estimatedCost: 65,
              iconType: "utensils"
            }
          ]
        }
      ],
      travelTips: [
        { category: "Culture", title: "Temple & Mosque Respect", content: "Always slip off shoes before entering mosques and temples. Wear clothing that covers shoulders and knees." },
        { category: "Safety", title: "Water and Hydration Guard", content: "Avoid any unfiltered tap water. Drink exclusively from sealed mineral bottles. Enjoy freshly peeled fruits." },
        { category: "Transport", title: "Embarking on Ambassador Cars", content: "Our private car driver handles luggage, stays with the vehicle at tourist stops, and remains on standby." },
        { category: "Local Food", title: "Pure Vegetarian Thali Protocols", content: "Opt for 'Sudh Shakahari' (Pure Veg) diners for unmatched culinary safety and incredibly rich, traditional lentil curries." }
      ],
      packingList: [
        { item: "Flowing light linen shirts and cotton harem pants", category: "Clothing" },
        { item: "Hand sanitizer and skin mosquito spray", category: "Toiletries" },
        { item: "High protection sunscreen cream & polarized shade sunglasses", category: "Essentials" },
        { item: "Indian Rupee cash bills (handy for tiny temple donations)", category: "Essentials" },
        { item: "Universal electrical outlet converter pin-adapter", category: "Electronics" }
      ],
      locationDetails: {
        country: "India",
        city: "Jaipur & Agra",
        timezone: "IST",
        currencyCode: "INR",
        currencySymbol: "₹",
        lat: 26.9124,
        lng: 75.7873
      }
    }
  },
  {
    name: "Kerala Backwaters & Tea Mountains",
    destination: "Kochi, Munnar, & Alleppey, India",
    budget: 1500,
    days: 4,
    travelStyle: "Relaxed",
    constraints: "Private luxury houseboat cruise, classic Kathakali arts view, mild spiced regional seafood.",
    badge: "🌴 Tropic Paradise",
    demoData: {
      destination: "Kochi & Munnar, Kerala, India",
      budget: 1500,
      days: 4,
      travelStyle: "Relaxed",
      currency: { code: "INR", symbol: "₹" },
      totalEstimatedCost: 1420,
      estimatedBudgetBreakdown: [
        { category: "Accommodation", amount: 750, percentage: 50, description: "Clifftop organic cottage amongst tea clouds in Munnar and private double-room wooden Houseboat cruise over Alleppey lake." },
        { category: "Food & Dining", amount: 280, percentage: 19, description: "Authentic spice-crusted Karimeen fish cooked on banana leaves, coconut-whipped rice stews, and ginger-infused tea harvests." },
        { category: "Activities", amount: 180, percentage: 12, description: "Kathakali classical dance drama front-row tickets, tea factory processing tour, and therapeutic Ayurvedic herbal oils treatment." },
        { category: "Transport", amount: 150, percentage: 10, description: "Scenic air-con vehicle transit with friendly local English/Malayalam speaking helper across Western Ghat loops." },
        { category: "Miscellaneous", amount: 60, percentage: 9, description: "Premium cardamoms, pure sandalwood soaps, and voluntary temple or helper gratitudes." }
      ],
      itinerary: [
        {
          day: 1,
          title: "Colonial Kochi & Kathakali Eye-Dramas",
          dayCost: 310,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Chinese Fishing Nets Coastal Walk",
              description: "Watch local fishermen operate massive teakwood cantilever fishing systems. Inspect 16th-century Portuguese stone basilicas.",
              locationName: "Fort Kochi Coastline",
              estimatedCost: 15,
              iconType: "walk"
            },
            {
              timeOfDay: "Afternoon",
              title: "Ginger Warehouse & Mattancherry Palace",
              description: "Stroll smelling cardamoms in historic spice quarters, followed by inspecting Hindu mythological wall murals.",
              locationName: "Jew Town Merchants Quarter, Kochi",
              estimatedCost: 20,
              iconType: "shopping"
            },
            {
              timeOfDay: "Evening",
              title: "Classic Kathakali Mudra Dance Theatre",
              description: "Witness the painstaking hour-long facial makeup process, followed by vivid dramatic stories told purely with eyes and hand mudras.",
              locationName: "Kerala Kathakali Centre, Fort Kochi",
              estimatedCost: 35,
              iconType: "landmark"
            }
          ]
        },
        {
          day: 2,
          title: "Munnar's Emerald Tea Garden Mist",
          dayCost: 390,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Drive through Valara Waterfalls",
              description: "Ascend the Western Ghats mountain road, stopping to see dramatic forest waterfalls and wild cardamom shrubs.",
              locationName: "Kochi to Munnar Mountain Route",
              estimatedCost: 45,
              iconType: "bus"
            },
            {
              timeOfDay: "Afternoon",
              title: "Lockhart Organic Tea Factory & Estate",
              description: "Amble down beautiful symmetric green tea paths. Taste crisp orange pekoe leaves and watch old black-tea furnaces smoke.",
              locationName: "Munnar tea heights",
              estimatedCost: 25,
              iconType: "tree"
            },
            {
              timeOfDay: "Evening",
              title: "Fresh Herbal Kerala Stew Dinner",
              description: "Dine on creamy sweet coconut milk potato stews and fluffy fermented rice cakes (Appam) over fresh banana leaves.",
              locationName: "Rapsy Cafe, Munnar hills",
              estimatedCost: 18,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 3,
          title: "The Floating Sanctuary — Houseboat Glide",
          dayCost: 480,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Boarding the Traditional Kettuvallam Houseboat",
              description: "Step onto a luxury hand-tied coir and bamboo boat. Float past giant coconut trees and small Kerala village banks as fresh juices launch.",
              locationName: "Alleppey Backwaters jetty",
              estimatedCost: 260,
              iconType: "beach"
            },
            {
              timeOfDay: "Afternoon",
              title: "Waterway Village Boat cruise",
              description: "Watch fishermen catching pearl spot fish on narrow canoes while our onboard private chef grills the afternoon catch over mustard spices.",
              locationName: "Vembanad Lake canal loops",
              estimatedCost: 40,
              iconType: "beach"
            },
            {
              timeOfDay: "Evening",
              title: "Candlelit Lagoon Anchoring",
              description: "Anchor in calm, quiet village waterways. Listen to frogs croak under orange sunset reflections, dining on native red parboiled rice.",
              locationName: "Houseboat Private Anchor Point",
              estimatedCost: 50,
              iconType: "moon"
            }
          ]
        },
        {
          day: 4,
          title: "Sandalwoods & Ayurvedic Recovery Garden",
          dayCost: 240,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Ayurvedic Sirodhara Oil Therapy",
              description: "Melt under a rhythmic continuous pour of warm, organic herbal-infused sesame and coconut oil onto your third eye chakra.",
              locationName: "Nirvana Ayurvedic Rejuvenation Spa",
              estimatedCost: 65,
              iconType: "tree"
            },
            {
              timeOfDay: "Afternoon",
              title: "Organic Cardamom & Pepper Plantation walk",
              description: "Trek through fertile green gardens to see cloves, cinnamon bark, pepper vines, and vanilla pods growing in their natural ecosystem.",
              locationName: "Spice World Estate, Thekkady edge",
              estimatedCost: 20,
              iconType: "walk"
            },
            {
              timeOfDay: "Evening",
              title: "Ginger Tea & Malayalam Coastal Fare",
              description: "Feast on regional coastal seafood curated with fresh mustard seeds, curry leaves, and grated coconut pulp.",
              locationName: "Grand Pavilion Coastal Diner, Kochi",
              estimatedCost: 35,
              iconType: "utensils"
            }
          ]
        }
      ],
      travelTips: [
        { category: "Culture", title: "Foot Etiquette and Shaking Hands", content: "Kerala has polite traditional roots. Remove footwear before steps of a home or wooden houseboat temple. Greet locals with 'Namaskaram'." },
        { category: "Safety", title: "Monsoon & Insect Guard", content: "Being tropical, Kerala hosts evening mosquitoes. Keep natural eucalyptus sprays handy and sleep under the provided canvas bedroom nets." },
        { category: "Transport", title: "Cruising the Waterways safely", content: "Houseboats proceed slow and safe. Do not leap into the channels which can run deep with thick kelp weed." },
        { category: "Local Food", title: "Banana Leaf Feast Rules", content: "Traditional feasts are eaten strictly with your right hand. Wash hands thoroughly before and after sitting down." }
      ],
      packingList: [
        { item: "Lightweight loose white linens and fast dry sandals", category: "Clothing" },
        { item: "Organic citronella oil insect repellent", category: "Toiletries" },
        { item: "Sleek swim trunks and waterproof mobile cover bag", category: "Clothing" },
        { item: "Kindle or travel notebook for houseboat decks", category: "Other" },
        { item: "Light power-bank to keep camera charged on canals", category: "Electronics" }
      ],
      locationDetails: {
        country: "India",
        city: "Kochi & Munnar",
        timezone: "IST",
        currencyCode: "INR",
        currencySymbol: "₹",
        lat: 9.9312,
        lng: 76.2673
      }
    }
  },
  {
    name: "Paris Royale & Seine Art",
    destination: "Paris and Versailles, France",
    budget: 2800,
    days: 5,
    travelStyle: "Cultural",
    constraints: "Vegetarian bakeries, private river cruise, skip-the-line museum tickets.",
    badge: "🗼 Parisian Art",
    demoData: {
      destination: "Paris & Versailles, France",
      budget: 2800,
      days: 5,
      travelStyle: "Cultural",
      currency: { code: "EUR", symbol: "€" },
      totalEstimatedCost: 2650,
      estimatedBudgetBreakdown: [
        { category: "Accommodation", amount: 1100, percentage: 39, description: "Quaint romantic boutique hotel in the historic Marais district & Versailles castle hotel." },
        { category: "Food & Dining", amount: 650, percentage: 23, description: "Traditional French vegetarian bistros, artisanal croissant sampling, and Michelin-starred cafe terraces." },
        { category: "Activities", amount: 450, percentage: 16, description: "VIP fast-track Louvre & d'Orsay museum entries, private Seine evening sail, and Versailles garden entry." },
        { category: "Transport", amount: 250, percentage: 9, description: "Bilingual private transfers, regional RER rail passes, and local antique bicycle hire." },
        { category: "Miscellaneous", amount: 200, percentage: 13, description: "Heirloom lavender soaps, high-grade organic teas, and voluntary gallery tips." }
      ],
      itinerary: [
        {
          day: 1,
          title: "Romantic Marais Courtyards & Historic Cafes",
          dayCost: 480,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Vosges Square Walk & Macaron Whisking",
              description: "Stroll around Paris's oldest symmetric square under vaulted stone arches, sampling legendary rose macarons.",
              locationName: "Place des Vosges, Marais",
              estimatedCost: 35,
              iconType: "walk"
            },
            {
              timeOfDay: "Afternoon",
              title: "Louvre Glass Pyramid Guided Insight",
              description: "Skip the heavy lines with a certified art curator, navigating directly to Greek masterpieces and the Mona Lisa.",
              locationName: "Musée du Louvre, Paris",
              estimatedCost: 75,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Illuminated Seine Sailing Cruise",
              description: "Glide on an elegant traditional wooden cruiser listening to live acoustic cellos as the Eiffel Tower sparkles.",
              locationName: "River Seine Embarkation, Port de la Bourdonnais",
              estimatedCost: 60,
              iconType: "moon"
            }
          ]
        },
        {
          day: 2,
          title: "Montmartre Art Groves & Vintage Bicycles",
          dayCost: 450,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Sacre-Coeur Peak Panoramic Ascent",
              description: "Climb the white-domed basilica hill early in the morning, getting a fresh portrait sketched by a local painter.",
              locationName: "Place du Tertre, Montmartre",
              estimatedCost: 30,
              iconType: "walk"
            },
            {
              timeOfDay: "Afternoon",
              title: "Vintage Bicycle Tour & Hidden Bakeries",
              description: "Pedal down historic cobblestone alleyways, stopping at century-old organic organic sourdough ovens.",
              locationName: "Canal Saint-Martin & Belleville",
              estimatedCost: 45,
              iconType: "bike"
            },
            {
              timeOfDay: "Evening",
              title: "Grand Brasserie Vegetarian Menu Gastronomie",
              description: "Dine on truffle gnocchi, roasted heritage root vegetables, and hot apple tarte tatin under Art Deco murals.",
              locationName: "Le Train Bleu, Paris Gare de Lyon",
              estimatedCost: 95,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 3,
          title: "The Golden Halls of Versailles Palace",
          dayCost: 550,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Express Royal Rail Transit",
              description: "Board the double-decker regional train, taking an elegant window seat overlooking the scenic French country outskirts.",
              locationName: "Gare de l'Est to Versailles Chateau",
              estimatedCost: 15,
              iconType: "bus"
            },
            {
              timeOfDay: "Afternoon",
              title: "Hall of Mirrors & Royal Apartments Tour",
              description: "Roam King Louis XIV's breathtaking mirrored galleries, marveling at pure crystal chandeliers and grand golden gates.",
              locationName: "Château de Versailles, France",
              estimatedCost: 55,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Versailles Fountain Gardens Candlelit Dinner",
              description: "Watch royal musical fountain jets perform under classical strings, dining at a fine historic estate overlooking the Grand Canal.",
              locationName: "La Flottille Restaurant, Versailles Gardens",
              estimatedCost: 110,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 4,
          title: "Impressionist Masterworks & Seine Banks",
          dayCost: 420,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Musée d'Orsay Station Clock Walk",
              description: "Roam inside the former grand Beaux-Arts railway station, admiring Monet, Degas, and Van Gogh oils with a scholar.",
              locationName: "Musée d'Orsay, Left Bank",
              estimatedCost: 40,
              iconType: "landmark"
            },
            {
              timeOfDay: "Afternoon",
              title: "Latin Quarter Botanical Stroll",
              description: "Amble under giant Roman columns through historic university courtyards and glass botanical greenhouses.",
              locationName: "Jardin des Plantes & Sorbonne Quarter",
              estimatedCost: 15,
              iconType: "tree"
            },
            {
              timeOfDay: "Evening",
              title: "Seine Book Stall Antique Hunt & Bistro Dinner",
              description: "Browse riverside green stalls for vintage books, finishing with goat-cheese soufflés and cardamom ice-cream.",
              locationName: "Saint-Germain-des-Prés Historic Corner",
              estimatedCost: 75,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 5,
          title: "Tuileries Fountains & Boulevard Farewell",
          dayCost: 510,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Tuileries Royal Garden Walk & Tea Palace",
              description: "Sip top-grade white tea under gilded moldings, appreciating classical marble statues scattered across symmetry lawns.",
              locationName: "Jardin des Tuileries & Angelina Paris",
              estimatedCost: 45,
              iconType: "tree"
            },
            {
              timeOfDay: "Afternoon",
              title: "Artisanal Perfume Designing Masterclass",
              description: "Sift through lavender, vetiver, and jasmine essential oils, blending your own custom fragrance inside a historic boutique vault.",
              locationName: "Fragonard Perfume Museum, Paris",
              estimatedCost: 90,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Eiffel Summit Sunset Toast & Farewell Feast",
              description: "Raise a crystal glass of sparkling cider over a panorama sunset view of Paris, accompanied by a luxury French-Mediterranean feast.",
              locationName: "Le Jules Verne, Eiffel Tower Tier 2",
              estimatedCost: 180,
              iconType: "utensils"
            }
          ]
        }
      ],
      travelTips: [
        { category: "Culture", title: "Greeting Etiquette", content: "Always initiate encounters with a warm 'Bonjour' or 'Bonsoir'. Saying hello is the absolute golden key of French politeness." },
        { category: "Safety", title: "Metro Pickpocket Guards", content: "Be highly attentive around crowded train station lines and Eiffel queues. Store bags safely forward-facing." },
        { category: "Transport", title: "Ferry & Metro Efficiency", content: "Buy a 'Navigo Easy' subway card or download the IDF Mobilités app. Cabs can get stuck in Parisian boulevard gridlocks." },
        { category: "Local Food", title: "Bakery protocols", content: "Order fresh 'Baguette Tradition' at local boulangeries for a crispy, artisan sourdough, and accept the classic seasonal fruit tarts." }
      ],
      packingList: [
        { item: "Stylish comfortable walking shoes (Paris averages 15k steps daily)", category: "Clothing" },
        { item: "Navigo Metro card pre-loaded on your smartphone", category: "Essentials" },
        { item: "Ultra-compact travel umbrella for sudden Parisian rains", category: "Other" },
        { item: "A sleek cross-body bag with multi-zip components", category: "Essentials" },
        { item: "French phrase pocketbook or offline translation app", category: "Other" }
      ],
      locationDetails: {
        country: "France",
        city: "Paris",
        timezone: "CET",
        currencyCode: "EUR",
        currencySymbol: "€",
        lat: 48.8566,
        lng: 2.3522
      }
    }
  },
  {
    name: "Amalfi Leisure Shoreline",
    destination: "Positano & Amalfi Coast, Italy",
    budget: 4200,
    days: 4,
    travelStyle: "Relaxed",
    constraints: "Sailing preference, local seafood specialty, minimal rugged hiking.",
    badge: "🇮🇹 Coastline",
    demoData: {
      destination: "Amalfi Coast, Italy",
      budget: 4200,
      days: 4,
      travelStyle: "Relaxed",
      currency: { code: "EUR", symbol: "€" },
      totalEstimatedCost: 4050,
      estimatedBudgetBreakdown: [
        { category: "Accommodation", amount: 2200, percentage: 52, description: "Clifftop boutique resort with private balcony overlooking Positano Bay." },
        { category: "Food & Dining", amount: 950, percentage: 23, description: "Michelin-recommended seafood, fresh lemon pastas, cliffside sunsets, and limoncello tastings." },
        { category: "Activities", amount: 600, percentage: 14, description: "Private half-day wooden Gozzo boat tour to Capri blue grottos and villa entry fees." },
        { category: "Transport", amount: 250, percentage: 6, description: "Ferry transits between towns and private premium shuttle from Naples airport." },
        { category: "Miscellaneous", amount: 200, percentage: 5, description: "Artisanal hand-painted Amalfi ceramics, custom linen garments, and gratuities." }
      ],
      itinerary: [
        {
          day: 1,
          title: "Cobblestone Romance & Sunset Limon",
          dayCost: 310,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Positano Cliffwalk & Pastel Terraces",
              description: "Explore narrow stairwells bordered by pink bougainvillea, making your way to Spiaggia Grande beach with zero rush.",
              locationName: "Spiaggia Grande, Positano",
              estimatedCost: 15,
              iconType: "walk"
            },
            {
              timeOfDay: "Afternoon",
              title: "Artisanal Lemon Sorbet & Linen Fitting",
              description: "Settle on a scenic cafe terrace to eat giant lemons stuffed with sorbet, then watch sandals get handmade on the spot.",
              locationName: "La Zagara, Positano",
              estimatedCost: 45,
              iconType: "shopping"
            },
            {
              timeOfDay: "Evening",
              title: "Candlelit Cliffside Seafood Gathering",
              description: "Dine on squid-ink pasta and sea bass baked in sea salt, looking down at Positano's twinkling fairy-light hillside.",
              locationName: "Ristorante Max, Positano",
              estimatedCost: 120,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 2,
          title: "Private Emerald Sea Sail to Capri",
          dayCost: 480,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Wooden Gozzo Boat Coastal Charter",
              description: "Step aboard an authentic wood-trimmed boat with a local skipper. Glide past sea caves and swim in sapphire pools.",
              locationName: "Positano Harbor to Capri Isle",
              estimatedCost: 320,
              iconType: "beach"
            },
            {
              timeOfDay: "Afternoon",
              title: "Capri Garden of Augustus & Hilltop Funicular",
              description: "Ride the cable car to historic Capri town, walking through lush terraced gardens overlooking the Faraglioni limestone arches.",
              locationName: "Anacapri & Faraglioni Vistas",
              estimatedCost: 40,
              iconType: "tree"
            },
            {
              timeOfDay: "Evening",
              title: "Waterfront harbor dining at Marina Grande",
              description: "Watch luxury yachts anchor while eating local caprese salad and freshly caught lemon-infused grilled octopus.",
              locationName: "Ristorante Da Gemma, Capri",
              estimatedCost: 90,
              iconType: "moon"
            }
          ]
        },
        {
          day: 3,
          title: "Amalfi Duomo Secrets & Ravello Heights",
          dayCost: 180,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Ferry Cruise to Historic Amalfi Town",
              description: "Delight in sea breezes while taking a 25-minute hydrofoil ride, disembarking near the spectacular Moorish-Byzantine cathedral.",
              locationName: "Piazza del Duomo, Amalfi Town",
              estimatedCost: 20,
              iconType: "bus"
            },
            {
              timeOfDay: "Afternoon",
              title: "Ravello Mountain Garden of Ville Rufolo",
              description: "Board a light shuttle up to the high town of Ravello. Walk through legendary terraces suspended halfway between sky and sea.",
              locationName: "Villa Rufolo Gardens, Ravello",
              estimatedCost: 35,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Romantic Ravello Terrace Sunset Dinner",
              description: "Relish hand-rolled pasta while listening to live acoustic guitar and overlooking Amalfi's lemon groves below.",
              locationName: "Cumpà Cosimo, Ravello",
              estimatedCost: 80,
              iconType: "utensils"
            }
          ]
        },
        {
          day: 4,
          title: "Fiordo di Furore & Olive Grove Farewell",
          dayCost: 230,
          activities: [
            {
              timeOfDay: "Morning",
              title: "Scenic Clifftop Road Trip & Fiord Di Furore",
              description: "A professional driver secures a smooth voyage to Amalfi's tiny secret gorge beach nestled below a colossal arched bridge.",
              locationName: "Fiordo di Furore Secret Shore",
              estimatedCost: 60,
              iconType: "beach"
            },
            {
              timeOfDay: "Afternoon",
              title: "Artisan Papermaking Craft Demonstration",
              description: "Witness cotton transformed into heavy thick sheets at a historic paper mill operational since the 13th century.",
              locationName: "Museo della Carta, Amalfi",
              estimatedCost: 18,
              iconType: "landmark"
            },
            {
              timeOfDay: "Evening",
              title: "Stellar Cliffside Farewell Capriccio",
              description: "Celebrate the final sunset with woodfired Neapolitan pizzas and a curated flight of local organic aglianico wines.",
              locationName: "Ristorante Panorama, Praiano",
              estimatedCost: 75,
              iconType: "moon"
            }
          ]
        }
      ],
      travelTips: [
        { category: "Culture", title: "Dining Timings", content: "Southern Italians dine late! Dinner usually kicks off around 8:30 PM. Secure reservation tables weeks in advance for seaside perches." },
        { category: "Safety", title: "Motion Sickness and Steps", content: "The coastal road consists of endless hairpins. If prone to car sickness, stick to the ferries (which are steady) and keep ginger candies handy." },
        { category: "Transport", title: "Ferry Over Cabs", content: "Local taxis are notoriously expensive ($80 for short hops). The travel ferry network is incredibly efficient, scenic, and costs only €10-€20 per ride." },
        { category: "Local Food", title: "Limoncello Protocol", content: "Always accept ice-cold limoncello after meals! It is served complimentary as a digestivo. Sip it slowly; it is potent!" }
      ],
      packingList: [
        { item: "Packable linen shirt & wide-brim resort hat", category: "Clothing" },
        { item: "Non-slip boat yacht sneakers (sailing standard)", category: "Clothing" },
        { item: "Polarized glasses (essential for water glares)", category: "Electronics" },
        { item: "High-protection reef safe sunscreen", category: "Toiletries" },
        { item: "Light water-resistant dry-bag for sails", category: "Other" }
      ],
      locationDetails: {
        country: "Italy",
        city: "Amalfi & Positano",
        timezone: "CET",
        currencyCode: "EUR",
        currencySymbol: "€",
        lat: 40.6331,
        lng: 14.6027
      }
    }
  }
];
