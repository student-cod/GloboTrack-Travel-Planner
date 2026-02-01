
import { GoogleGenAI, Type } from "@google/genai";
import { TravelRoute } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTravelRoutes = async (source: string, destination: string): Promise<TravelRoute[]> => {
  const prompt = `Generate 3 diverse travel routes from ${source} to ${destination}. 
  Include direct options if they exist, or indirect options involving flights, trains, or buses.
  Return the response in JSON format. 
  IMPORTANT: Provide all costs and prices in Indian Rupees (INR). Ensure the amounts are accurate estimates for the current market.
  For each route, suggest specific booking platforms like Skyscanner, Omio, Google Flights, MakeMyTrip, or IRCTC where applicable.
  Include an estimated price for that specific platform and a direct URL to the booking site.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            totalCost: { type: Type.NUMBER, description: 'Total cost in INR' },
            totalDuration: { type: Type.STRING },
            transfers: { type: Type.NUMBER },
            legs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  type: { type: Type.STRING, description: 'flight, train, or bus' },
                  duration: { type: Type.STRING },
                  cost: { type: Type.NUMBER, description: 'Cost in INR' },
                  carrier: { type: Type.STRING }
                },
                required: ["from", "to", "type", "duration", "cost"]
              }
            },
            bookingOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  platform: { type: Type.STRING },
                  price: { type: Type.NUMBER, description: 'Price on this platform in INR' },
                  url: { type: Type.STRING }
                },
                required: ["platform", "price", "url"]
              }
            }
          },
          required: ["name", "totalCost", "totalDuration", "transfers", "legs", "bookingOptions"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
};

export const chatWithTravelAI = async (message: string, history: {role: string, content: string}[]) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are GloboTrack AI, a specialized travel assistant. Help users with itinerary planning, packing tips, visa info, and local recommendations. Always provide prices in Indian Rupees (INR) when asked about costs. Be concise, friendly, and helpful."
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
