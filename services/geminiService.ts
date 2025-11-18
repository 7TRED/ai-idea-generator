import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Idea, IdeaAnalysis } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing");
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIdeasForTopic = async (topic: string, count: number = 6): Promise<Idea[]> => {
  const ai = getClient();

  const prompt = `Generate ${count} unique, innovative, and distinct startup or project ideas related to the topic: "${topic}". 
  Ensure they vary in complexity and target audience.
  Return the response in a structured JSON array.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            emoji: { type: Type.STRING },
            impactScore: { type: Type.NUMBER, description: "Score from 1 to 10 representing potential impact" },
            feasibilityScore: { type: Type.NUMBER, description: "Score from 1 to 10 representing ease of implementation" },
            colorTheme: { type: Type.STRING, description: "A hex color code suitable for this idea branding" }
          },
          required: ["title", "shortDescription", "tags", "emoji", "impactScore", "feasibilityScore", "colorTheme"]
        }
      }
    }
  });

  if (response.text) {
    try {
      const data = JSON.parse(response.text);
      // Add client-side IDs
      return data.map((item: any) => ({ ...item, id: crypto.randomUUID() }));
    } catch (e) {
      console.error("Failed to parse ideas JSON", e);
      return [];
    }
  }
  return [];
};

export const analyzeIdeaDeepDive = async (idea: Idea): Promise<IdeaAnalysis | null> => {
  const ai = getClient();

  const prompt = `Perform a deep-dive analysis on this startup idea:
  Title: ${idea.title}
  Description: ${idea.shortDescription}
  
  Provide a detailed breakdown including target audience, revenue models, tech stack, and a market analysis simulation.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetAudience: { type: Type.ARRAY, items: { type: Type.STRING } },
          revenueModels: { type: Type.ARRAY, items: { type: Type.STRING } },
          techStackRecommendation: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketAnalysis: {
            type: Type.OBJECT,
            properties: {
              competitorCount: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              demandLevel: { type: Type.NUMBER, description: "1-100" },
              growthPotential: { type: Type.NUMBER, description: "1-100" },
              difficulty: { type: Type.NUMBER, description: "1-100" }
            },
            required: ["competitorCount", "demandLevel", "growthPotential", "difficulty"]
          },
          nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          detailedDescription: { type: Type.STRING }
        },
        required: ["targetAudience", "revenueModels", "techStackRecommendation", "marketAnalysis", "nextSteps", "detailedDescription"]
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text) as IdeaAnalysis;
    } catch (e) {
      console.error("Failed to parse analysis JSON", e);
      return null;
    }
  }
  return null;
};

export const generateRelatedTopics = async (ideaTitle: string): Promise<string[]> => {
  const ai = getClient();
  const prompt = `Based on the idea "${ideaTitle}", suggest 4 related search topics that a user might want to explore next to broaden their horizons. Return just an array of strings.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  if (response.text) {
    try {
      return JSON.parse(response.text);
    } catch (e) {
      return [];
    }
  }
  return [];
};

export const generateIdeaImage = async (ideaTitle: string, description: string): Promise<string | null> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `A minimalistic, modern, abstract 3D isometric digital art representation of a startup idea called "${ideaTitle}". Concept: ${description}. High quality, trending on dribbble, clean background.` }]
      },
      config: {
        responseModalities: [Modality.IMAGE],
      }
    });
    
    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
       return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (e) {
    console.error("Image gen failed", e);
    return null;
  }
};