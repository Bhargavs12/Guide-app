import { GoogleGenAI } from "@google/genai";
import { Guide } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getGuideRecommendations(userPreferences: string, availableGuides: Guide[]): Promise<string[]> {
  try {
    const prompt = `
      You are an expert travel consultant for GUIDE KAROO. 
      Based on the following user preferences: "${userPreferences}"
      And the following available guides: ${JSON.stringify(availableGuides.map(g => ({ id: g.id, name: g.name, specialty: g.specialties, location: g.location })))}
      
      Recommend the top 3 guide IDs that best match the user's needs.
      Return ONLY a JSON array of guide IDs.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "[]");
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return [];
  }
}
