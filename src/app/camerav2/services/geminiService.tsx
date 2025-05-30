
import { GoogleGenAI, GenerateContentResponse, Part } from "@google/genai";

// IMPORTANT: As per instructions, process.env.API_KEY is used directly.
// This is highly insecure for a client-side application.
// In a real-world scenario, this API key should be handled by a backend proxy.
// The execution environment MUST provide process.env.API_KEY.
const API_KEY = process.env.NEXT_PUBLIC_GEMINI;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI. Check API Key format or library compatibility.", e);
    // ai remains null, errors will be thrown by extractInfoFromImage
  }
} else {
  console.error(
    "CRITICAL: Gemini API Key (process.env.API_KEY) is not set. The application will not function without it."
  );
}

export const extractInfoFromImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | undefined> => {
  if (!ai) {
    // This error will also cover cases where API_KEY was missing or initialization failed.
    throw new Error(
      "Gemini API client is not initialized. Ensure API_KEY is correctly configured and available in the environment."
    );
  }

  try {
    const imagePart: Part = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };

    const textPart: Part = {
      text: prompt,
    };

    // Using the specified model for multimodal capabilities
    const model = 'gemini-2.5-flash-preview-04-17';

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: { parts: [imagePart, textPart] },
      }
    );
    
    return response.text;

  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    // Check for specific GoogleGenAIError structure if available and needed
    // For now, rethrow a generic message or the error's message.
    let errorMessage = "An unknown error occurred while contacting the Gemini API.";
    if (error.message) {
        errorMessage = `Gemini API Error: ${error.message}`;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // More detailed error parsing could be added here if the API returns structured errors consistently.
    // e.g., error.response?.data?.error?.message
    
    // If the error object has details about safety ratings or blocks
    if (error.response && error.response.promptFeedback) {
        const feedback = error.response.promptFeedback;
        if (feedback.blockReason) {
            errorMessage += ` Blocked due to: ${feedback.blockReason}.`;
            if (feedback.safetyRatings && feedback.safetyRatings.length > 0) {
                errorMessage += ` Categories: ${feedback.safetyRatings.map((r: any) => r.category).join(', ')}.`;
            }
        }
    }
    throw new Error(errorMessage);
  }
};
