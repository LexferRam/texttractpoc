export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server"
import { extractInfoFromImage } from "../../camerav2/services/geminiService";
import { findBestMatchingBrand } from "@/app/camerav2/services/geminiServiceII";

export async function POST(request: NextRequest) {

    const { arrayBrands, searchTerm } = await request.json()


    try {
        const response = await findBestMatchingBrand(arrayBrands, searchTerm)


        return NextResponse.json({ 
            data: response?.length ? JSON.parse(response) : response
        }, { status: 200 })



    } catch (error) {
        console.error("Error processing image:", error);
        return NextResponse.json({ error: "Error processing image" }, { status: 500 })
    }
}

