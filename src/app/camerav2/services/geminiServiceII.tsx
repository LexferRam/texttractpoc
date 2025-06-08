
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Please set it before running the application.");
  // Potentially throw an error or handle this state in the UI
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion as we check above, or app shouldn't start

export async function findBestMatchingBrand(brands: any, searchTerm: string): Promise<any | null> {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured.");
  }
  if (!searchTerm.trim()) {
    throw new Error("Search term cannot be empty.");
  }
  if (brands.length === 0) {
    throw new Error("Brand list cannot be empty.");
  }

  const prompt = `
Given the following list of vehicle brands:
${brands.map((brand: any) => `- VALOR: ${brand.VALOR}, DESCRIP: ${brand.DESCRIP}`).join('\n')}

And the search term: "${searchTerm}"

Which brand from the list is the best match for the search term?
Consider partial matches, common misspellings, or related terms if an exact match for DESCRIP is not found.
Respond with ONLY the VALOR of the best matching brand from the provided list.
If no brand is a reasonably good match, respond with "NONE".
  `.trim();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: prompt,
    });
    
    const matchedValor = response?.text?.trim();

    if (matchedValor === "NONE") {
      return null;
    }

    const foundBrand = brands.find((brand: any) => brand.VALOR === matchedValor);
    return foundBrand || null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error("Invalid Gemini API Key. Please check your configuration.");
        }
         throw new Error(`Failed to get match from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
}
