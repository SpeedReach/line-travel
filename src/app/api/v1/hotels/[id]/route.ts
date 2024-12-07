
import { db } from "@/db";
import { hotels } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { ParseDeleteRequest } from "./delete-helpers";
import { ParsePutRequest } from "./put-helpers";
import { latLngToCell } from "h3-js";

// DELETE
export async function DELETE(
    request: NextRequest
): Promise<NextResponse> {
    const hotelId = ParseDeleteRequest(request)
    if (hotelId instanceof Error){
        return new NextResponse(JSON.stringify({ error: "Invalid Hotel Id" }), {
            status: 400,
        });
    }

    try {
        const res = await db
            .delete(hotels)
            .where(eq(hotels.id, hotelId));

        if (res[0].affectedRows === 0) {
            return new NextResponse(
                JSON.stringify({ error: "Hotel not found" }),
                { status: 404 }
            );
        }

        return new NextResponse(undefined, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}




export async function PUT(
    request: NextRequest
): Promise<NextResponse> {
    const requestArgs = await ParsePutRequest(request)
    if (requestArgs instanceof Error){
        return new NextResponse(JSON.stringify({ error: "Invalid Request" }), {
            status: 400,
        });
    }

    try {
        const res = await db
            .update(hotels)
            .set({
                name: requestArgs.name,
                webLink: requestArgs.webLink,
                address: requestArgs.address,
                email: requestArgs.email,
                status: requestArgs.status,
                coordinate: `${requestArgs.lng},${requestArgs.lat}`,
                h3Index: latLngToCell(requestArgs.lat, requestArgs.lng, 7),
            })
            .where(eq(hotels.id, requestArgs.id));

        if (res[0].affectedRows === 0) {
            return new NextResponse(
                JSON.stringify({ error: "Hotel not found" }),
                { status: 404 }
            );
        }

        return new NextResponse(undefined, { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
    
}

