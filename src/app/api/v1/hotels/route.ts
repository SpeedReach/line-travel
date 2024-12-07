import { db } from "@/db/index";
import { hotels } from "@/db/schema";
import { latLngToCell } from "h3-js";
import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { ParseQueryHotelRequest, QueriedHotel, QueryHotelResponse } from "./get-helpers";
import { ParsePostRequest, PostHotelResponse } from "./post-helpers";
import { ParsePutRequest } from "./[id]/put-helpers";


const optimalResolution = 7

//GET
export async function GET(
    request: NextRequest
): Promise<NextResponse<QueryHotelResponse>> {
    const requestArgs = ParseQueryHotelRequest(request)
    if (requestArgs instanceof Error){
        return new NextResponse(JSON.stringify({ error: "Invalid Request" }), {
            status: 400,
        });
    }

    try {
        const h3Index = latLngToCell(requestArgs.lat, requestArgs.lng, optimalResolution);
        const rows = await db
            .select()
            .from(hotels)
            .where(eq(hotels.h3Index, h3Index));
        
        const results: QueriedHotel[] = rows.map((row) => {
            return {
                id: row.id,
                name: row.name,
                webLink: row.webLink,
                address: row.address,
                email: row.email,
                status: row.status,
                coordinate: row.coordinate,
            };
        });

        return NextResponse.json({ hotels: results }, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            {
                status: 500,
            }
        );
    }
}




export async function POST(
    request: NextRequest
): Promise<NextResponse<PostHotelResponse>> {
    const requestArgs = await ParsePostRequest(request)
    if (requestArgs instanceof Error){
        return new NextResponse(JSON.stringify({ error: requestArgs.message }), {
            status: 400,
        });
    }

    try {
        const res = await db.insert(hotels).values({
            name: requestArgs.name,
            webLink: requestArgs.webLink,
            address: requestArgs.address,
            email: requestArgs.email,
            status: requestArgs.status,
            coordinate: `${requestArgs.lng},${requestArgs.lat}`,
            h3Index: latLngToCell(requestArgs.lat, requestArgs.lng, 7),
        });

        return new NextResponse(JSON.stringify({ hotelId: res[0].insertId }), {
            status: 201,
        });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}

