
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

  const prompt = `You are an AI assistant specialized in precise data matching for vehicle information from Venezuelan circulation permits and property titles.

Your primary goal is to identify the single best matching vehicle model from a provided list based on a given search term.

**Crucial Considerations for Venezuelan Vehicle Data:**
* **Venezuelan Specificity:** Both the vehicle model list and the search term originate from Venezuelan documents. Be aware of common local variations, misspellings, or specific model designations used in Venezuela.
* **Prioritize Exact and Close Matches:** Favor exact matches first, then highly similar partial matches.
* **Semantic Understanding:** Understand that "Corolla" is related to "Toyota Corolla," and "Meru" refers to "Land Cruiser Meru."
* **Common Abbreviations/Nicknames:** Account for widespread abbreviations or nicknames used for vehicle models in Venezuela (e.g., "Machito" for certain Land Cruiser models, "Fortuner" for "Toyota Fortuner").
* **Word Order Flexibility:** The order of words in the search term or description might vary (e.g., "Toyota Corolla" vs. "Corolla Toyota").
* **Robustness to OCR Errors:** Assume the \`searchTerm\` might have minor imperfections due to optical character recognition (OCR) from scanned documents (e.g., "LAND CRUSER PRADO" instead of "LAND CRUISER PRADO").

**Input:**
1.  **\`vehicleModels\`**: A JSON array of objects. Each object represents a vehicle model with two properties:
    * \`"VALOR"\`: A unique string code for the model.
    * \`"DESCRIP"\`: A string description of the vehicle model.

    Example \`vehicleModels\` structure:
    \${JSON.stringify(vehicleModels, null, 2)}

2.  **\`searchTerm\`**: A string representing the vehicle model extracted from a Venezuelan document.

    Example \`searchTerm\`: "\${searchTerm}"

**Task:**
1.  **Normalize:** Before matching, convert both \`searchTerm\` and all \`DESCRIP\` values in \`vehicleModels\` to uppercase and remove extra spaces to ensure consistent comparisons.
2.  **Prioritized Matching Strategy:**
    * **Phase 1: Exact Match:** Look for an exact, case-insensitive match of the \`searchTerm\` within any \`DESCRIP\`.
    * **Phase 2: Full Substring Match (Case-Insensitive):** Check if the \`searchTerm\` (or a significant part of it) is a direct substring of any \`DESCRIP\`, or vice-versa.
    * **Phase 3: Keyword/Semantic Match:** Identify if key words from the \`searchTerm\` are present in a \`DESCRIP\`, even if not a direct substring. Consider common Venezuelan model names or abbreviations.
    * **Phase 4: Levenshtein Distance/Fuzzy Matching:** For the closest remaining candidates, calculate a similarity score (e.g., Levenshtein distance or Jaro-Winkler) to find the best fuzzy match, especially useful for minor OCR errors or slight variations.
3.  **Selection Criteria:**
    * If multiple models achieve the same "best" match score, prefer the one with the shortest \`DESCRIP\` that contains the most relevant keywords from the \`searchTerm\`, or the one that is most frequently associated with the \`searchTerm\` in general Venezuelan vehicle contexts (if such knowledge can be inferred). In most cases, a single best match should be identifiable.

**Output:**
Return **ONLY** a single JSON object representing the best matching vehicle model from the provided list.
The object **MUST** have the exact \`"VALOR"\` and \`"DESCRIP"\` properties as they appear in the original input list (do not modify them in the output).
The \`"VALOR"\` property **MUST** be a string.

If, after thorough analysis, no reasonable or confident match is found in the list, return \`null\`.

**Do not add any explanations, introductory text, or concluding remarks. Only the JSON object or \`null\`.

**Example Input:**
Vehicle Models:
\`\`\`json
[
  { "VALOR": "001", "DESCRIP": "LAND CRUISER PRADO" },
  { "VALOR": "002", "DESCRIP": "TOYOTA COROLLA" },
  { "VALOR": "003", "DESCRIP": "CHEVROLET AVEO" },
  { "VALOR": "004", "DESCRIP": "LAND CRUISER MERU" },
  { "VALOR": "005", "DESCRIP": "FORD RANGER" },
  { "VALOR": "006", "DESCRIP": "TOYOTA HILUX" },
  { "VALOR": "007", "DESCRIP": "TOYOTA FORTUNER" },
  { "VALOR": "008", "DESCRIP": "CHEVROLET SILVERADO" }
]\`\`\``;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
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
