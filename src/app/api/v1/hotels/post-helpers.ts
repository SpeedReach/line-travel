import { NextRequest } from "next/server";
import { z } from "zod";

export const PostHotelBody = z.object({
    name: z.string().min(1),
    webLink: z.string().url().optional(),
    address: z.string().min(1),
    email: z.string().email(),
    status: z.number().int().min(0).max(1),
    lng: z.number().min(-180).max(180),
    lat: z.number().min(-90).max(90),
});

export interface PostHotelResponse {
    hotelId: number;
}

export interface PostHotelRequest{
    name: string;
    webLink: string | undefined;
    address: string;
    email: string;
    status: number;
    lng: number;
    lat: number;
}

export async function ParsePostRequest(request: NextRequest): Promise<PostHotelRequest| Error>{
    try {
        const hotelBody = PostHotelBody.parse(await request.json());
        return {
            name: hotelBody.name,
            webLink: hotelBody.webLink,
            address: hotelBody.address,
            email: hotelBody.email,
            status: hotelBody.status,
            lng: hotelBody.lng,
            lat: hotelBody.lat,
        };
    } 
    catch (error) {
        if(error instanceof z.ZodError){
            return new Error(error.message);
        }
        return new Error('Invalid Request');
    }
}