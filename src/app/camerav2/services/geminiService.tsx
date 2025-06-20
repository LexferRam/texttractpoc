
import { GoogleGenAI, GenerateContentResponse, Part, Type } from "@google/genai";
import { prompts } from "../const/prompts";
import { title } from "process";

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
  promptType: string
): Promise<string | undefined> => {
  if (!ai) {
    // This error will also cover cases where API_KEY was missing or initialization failed.
    throw new Error(
      "Gemini API client is not initialized. Ensure API_KEY is correctly configured and available in the environment."
    );
  }

  try {
    console.log(promptType)
    const imagePart: Part = {
      inlineData: {
        mimeType: mimeType,
        data: base64ImageData,
      },
    };

    const textPart: any = {
      text: prompts[promptType],
    };

    // Using the specified model for multimodal capabilities
    const model ='gemini-2.5-flash-lite-preview-06-17'// 'gemini-2.5-flash-preview-05-20';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      //'gemini-2.5-flash-preview-05-20',// casi 100% pero es mas lento, con limites de frecuencia restrictivos de un modelo experimental o de versión preliminar experimental
      //'gemini-2.5-pro-preview-05-06', // es un modelo preliminar. sin posibilidad de prueba en version gratuita
      //'gemini-2.0-flash', // buena respuesta pero a veces no captura la version y da respuesta de invalido en ciertas pruebas
      //'gemini-2.0-flash-lite', // ==> Un modelo Gemini 2.0 Flash optimizado para la rentabilidad y la baja latencia. (bastante buena la respuesta FUERTE CANDIDATO 1) generacion mas nueva
      //'gemini-1.5-flash-latest', (bastante buena la respuesta FUERTE CANDIDATO 2)
      //'gemini-1.5-flash-8b-latest', (a veces le cuesta el modelo (con errores) y casi siempre la version))
      //'gemini-1.5-flash-8b', // (estable más reciente- a veces le cuesta el modelo y casi siempre la version)
      // 'gemini-1.5-flash-8b-001' (Estable) ==> funciona bastante bien , a veces le cuesta el modelo y casi siempre la version
      //'gemini-1.5-pro'(NO FUNCIONA),
      //'gemini-2.0-flash-001'(funciona pero no reconoce cuando es CI invalida),
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json', // Ensure the response is in JSON format
        responseSchema: {
          type: Type.ARRAY,
          items: promptType === 'CI_RIF' ? {
            type: Type.OBJECT,
            title: "Información extraida de la CI o el RIF",
            description: "Información extraída de la CI o el RIF",
            properties: {
              numeroIdentificacion: {
                type: Type.STRING,
                description: "Numero de identificación, retorna string vacio si no captura valor",
              },
              nombre: {
                type: Type.STRING,
                description: "Nombres de la Cédula de identidad o RIF, retorna string vacio si no captura valor",
              },
              apellidos: {
                type: Type.STRING,
                description: "Apellidos de la Cédula de identidad o RIF, retorna string vacio si no captura valor",
              },
              fechaVencimiento: {
                type: Type.STRING,
                description: "Fecha de vencimiento de la Cédula de identidad o RIF, retorna string vacio si no captura valor",
              },
              documentValid: {
                type: Type.BOOLEAN,
                description: "Retorna true si es un documento válido (CI o RIF) y false si no lo es "
              },
              scannedDocument: {
                type: Type.STRING,
                enum: ["CI", "RIF"],
                description: "Tipo de documento escaneado,CI: para cédula, RIF: para RIF, retorna string vacio si no captura valor ",
              },
              tipoIdentificacion: {
                type: Type.STRING,
                enum: ["V", "P", "J", "G", "E"],
                description: "Tipo de identificación: retorna V si es Venezolano, P si es pasaporte, J si es jurídico, G si es gubernamental y E si es extranjero",
              },
            }
          } : {
            type: Type.OBJECT,
            description: "Información extraída del vehículo o documento",
            title: "Vehículo o Certificado Vehicular",
            // Aquí se definen las propiedades esperadas en el JSON de respuesta
            properties: {
              anio: {
                type: Type.STRING,
                description: "Año del vehículo o documento, retorna string vacio si no captura valor",
              },
              marca: {
                type: Type.STRING,
                description: "Marca del vehículo o documento, retorna string vacio si no captura valor",
              },
              modelo: {
                type: Type.STRING,
                description: "Modelo del vehículo o documento, retorna string vacio si no captura valor",
              },
              placa: {
                type: Type.STRING,
                description: "Placa del vehículo o documento, retorna string vacio si no captura valor",
              },
              serialMotor: {
                type: Type.STRING,
                description: "Serial del motor del vehículo o documento, buscar solo en caso de que el documento sea un título de propiedad, retorna string vacio si no captura valor o es un carnet de circulación",
              },
              serialCarroceria: {
                type: Type.STRING,
                description: "Serial de la carrocería del vehículo o documento, retorna string vacio si no captura valor",
              },
              color: {
                type: Type.STRING,
                description: "Color del vehículo o documento, retorna string vacio si no captura valor",
              },
              destinado: {
                type: Type.STRING,
                description: "Destinado del vehículo o documento, retorna string vacio si no captura valor",
              },
              grupo: {
                type: Type.STRING,
                description: "Grupo del vehículo o documento, retorna string vacio si no captura valor",
              },
              version: {
                type: Type.STRING,
                description: "Versión del vehículo o documento, retorna string vacio si no captura valor",
              },
              documentValid: {
                type: Type.BOOLEAN,
                description: "Retorna true si es un documento válido (Carnet de circulación ó título de propiedad) y false si no lo es "
              },
            }
          },
        }
      }
    }
    );

    console.log(`Thoughts tokens: ${response?.usageMetadata?.thoughtsTokenCount}`);
    console.log(`Output tokens: ${response?.usageMetadata?.candidatesTokenCount}`);

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
