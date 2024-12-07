import { NextRequest } from "next/server";
import { z } from "zod";

export const PutHotelBody = z.object({
    name: z.string().min(1),
    webLink: z.string().url().optional(),
    address: z.string().min(1),
    email: z.string().email(),
    status: z.number().int().min(0).max(1),
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
});

// PUT
export interface PutHotelRequest{
    id: number;
    name: string;
    webLink: string | undefined;
    address: string;
    email: string;
    status: number;
    lng: number;
    lat: number;
}

export async function ParsePutRequest(request: NextRequest): Promise<PutHotelRequest| Error>{
    const rawId = request.nextUrl.pathname.split("/").pop();
    if (!rawId) {
        return new Error('missing hotelId');
    }

    const hotelId = parseInt(rawId, 10);
    if (isNaN(hotelId)) {
        return new Error('hotelId is not a number');
    }

    try {
        const hotelBody = PutHotelBody.parse(await request.json());

        return {
            id: hotelId,
            name: hotelBody.name,
            webLink: hotelBody.webLink,
            address: hotelBody.address,
            email: hotelBody.email,
            status: hotelBody.status,
            lng: hotelBody.lng,
            lat: hotelBody.lat,
        };
    } catch (error) {
        if(error instanceof z.ZodError){
            return new Error(error.message);
        }
        return new Error('Invalid Request');
    }
}
