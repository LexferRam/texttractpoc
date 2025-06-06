export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server"
import { extractInfoFromImage } from "../../camerav2/services/geminiService";

export async function POST(request: NextRequest) {

    const { base64ImageData, mimeType, prompt } = await request.json()

    if (!base64ImageData || !mimeType || !prompt) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    try {
        const response = await extractInfoFromImage(base64ImageData, mimeType, prompt);
        console.log('Gemini analized image response:, ', response)
        return NextResponse.json({ 
            data: response?.length ? JSON.parse(response) : response
        }, { status: 200 })
    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: "Error processing image" }, { status: 500 })
    }
}

