
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { NFTStyle, NFTMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateNFTImage(prompt: string, style: NFTStyle, aspectRatio: string = "1:1"): Promise<string> {
  // Enhanced prompt engineering to match the requested PFP aesthetic
  const styleKeywords: Record<NFTStyle, string> = {
    [NFTStyle.BORED_APE]: "Bored Ape Yacht Club style, centered cartoon ape portrait, clean vector lines, flat vibrant background, characteristic NFT mouth and eyes expression, streetwear accessories.",
    [NFTStyle.CARTOON_CREATURE]: "Clean cartoonish monster/lizard style, thick bold outlines, flat colors, white t-shirt, gold chain accessory, vibrant background, simplistic character design.",
    [NFTStyle.CUTE_ANIMAL]: "Cute penguin/animal character, minimalist rounded shapes, wearing sunglasses and headgear, solid pastel background, simple heart detail on body, clean digital illustration.",
    [NFTStyle.PIXEL_ART]: "Retro 8-bit pixel art character, side-profile or front-facing, blocky aesthetic, solid blue background, high-contrast pixels, simple clothing."
  };

  const fullPrompt = `Generate a high-end NFT Profile Picture (PFP). 
    Subject: ${prompt}. 
    Style: ${styleKeywords[style]}. 
    Technical requirements: Centered composition, head and shoulders portrait, solid flat color background, clean professional lines, no text, no blurry edges, iconic digital collectible aesthetic.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Force 1:1 for PFP
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
}

export async function generateNFTMetadata(prompt: string, style: NFTStyle): Promise<NFTMetadata> {
  const systemInstruction = "You are an expert NFT curator for a top-tier PFP collection. Create a unique name (e.g., 'Bored Drake #402'), creative description, and 3-5 traits (Background, Fur, Eyes, Mouth, Accessory) for an NFT artwork based on the provided prompt and style.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Subject: ${prompt}, Style: ${style}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            traits: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  trait_type: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["trait_type", "value"]
              }
            }
          },
          required: ["name", "description", "traits"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (error) {
    console.error("Metadata generation failed:", error);
    return {
      name: "Legacy Specimen",
      description: "A rare digital artifact from the neural collection.",
      traits: [{ trait_type: "Edition", value: "Genesis" }]
    };
  }
}
