
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure process.env.API_KEY is handled as per instructions.
// The application assumes process.env.API_KEY is set in the environment.
let ai: GoogleGenAI | null = null;
let apiKeyError: string | null = null;

try {
  if (!process.env.NEXT_PUBLIC_GEMINI) {
    throw new Error("API_KEY environment variable not set.");
  }
  ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
  apiKeyError = error instanceof Error ? error.message : "An unknown error occurred during API key setup.";
}


export const findBestMatch = async (
  vehicleModels: any[],
  searchTerm: string
): Promise<any | null> => {
  if (apiKeyError) {
    throw new Error(`Gemini API not initialized: ${apiKeyError}`);
  }
  if (!ai) {
    throw new Error("Gemini API client is not available.");
  }

  if (vehicleModels.length === 0) {
    return null; // No models to search in
  }

  const prompt = `
You are an AI assistant specialized in data matching.
Your task is to find the single best matching vehicle version from the given list based on a search term.
The list of vehicle version is provided as a JSON array of objects, where each object has 'VALOR' (a code) and 'DESCRIP' (a description) properties.
The search term is a string that should be matched against the 'DESCRIP' property of the vehicle versions.

Analyze the following list of vehicle versions:
${JSON.stringify(vehicleModels, null, 2)}

Find the best match for the search term: "${searchTerm}"

Consider semantic similarity, partial matches, and common abbreviations.
Return ONLY a single JSON object representing the best matching vehicle model from the provided list. 
The object MUST have the exact 'VALOR' and 'DESCRIP' properties as found in the input list.
The VALOR property must be a string.

If no reasonable match is found in the list, return null.
Do not add any explanations, introductory text, or concluding remarks. Only the JSON object or null.

Example Input:
Vehicle versions:
[
  { "VALOR": "001", "DESCRIP": "LAND CRUISER PRADO" },
  { "VALOR": "002", "DESCRIP": "TOYOTA COROLLA" },
  { "VALOR": "004", "DESCRIP": "LAND CRUISER MERU" }
]
Search Term: "MERU"

Example Output (ensure VALOR is a string):
{ "VALOR": "004", "DESCRIP": "LAND CRUISER MERU" }

If search term is "Ford Ranger" and it's not in the list, output should be:
null
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",//'gemini-1.5-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2, // Lower temperature for more deterministic matching
      },
    });

    let jsonStr = response?.text?.trim() || '';
    // Remove Markdown code fences if present
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr?.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    // Handle cases where API might return "null" as a string
    if (jsonStr?.toLowerCase() === "null") {
        return null;
    }

    const parsedData = JSON.parse(jsonStr);

    if (parsedData === null) {
      return null;
    }

    if (parsedData && typeof parsedData.VALOR === 'string' && typeof parsedData.DESCRIP === 'string') {
      // Validate that the returned VALOR and DESCRIP exist in the original list (optional, but good for robustness)
      const originalMatch = vehicleModels.find(vm => vm.VALOR === parsedData.VALOR && vm.DESCRIP === parsedData.DESCRIP);
      if (originalMatch) {
        return originalMatch;
      } else {
        // If Gemini hallucinates a model not in the list, try to find the closest by description
        const descripMatch = vehicleModels.find(vm => vm.DESCRIP === parsedData.DESCRIP);
        if (descripMatch) return descripMatch;
        console.warn("Gemini returned a model not strictly in the original list, or with altered VALOR. Parsed:", parsedData);
        // Fallback: if VALOR is correct but DESCRIP was slightly altered by Gemini, still prefer the one with correct VALOR from list
        const valorMatch = vehicleModels.find(vm => vm.VALOR === parsedData.VALOR);
        if (valorMatch) return valorMatch;
        return null; // Could not reconcile
      }
    }
    
    console.warn("Gemini response was not the expected VehicleModel object or null:", parsedData);
    return null;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get match from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
