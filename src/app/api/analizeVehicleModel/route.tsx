export const maxDuration = 60;
import { findBestMatch } from "@/app/camerav2/services/geminiServiceIII";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

    const { arrayModels, searchTerm } = await request.json()


    try {
        const response = await findBestMatch(arrayModels, searchTerm)

        console.log(response)

        return NextResponse.json({ 
            data: response?.length ? JSON.parse(response) : response
        }, { status: 200 })



    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: "Error processing image" }, { status: 500 })
    }
}

