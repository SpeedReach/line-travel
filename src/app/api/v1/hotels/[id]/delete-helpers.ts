import { type NextRequest } from "next/server";

export function ParseDeleteRequest(request: NextRequest): number| Error {
    const rawId = request.nextUrl.pathname.split("/").pop();
    if (!rawId) {
        return new Error('missing hotelId');
    }
    const hotelId = parseInt(rawId, 10);
    if (isNaN(hotelId)) {
        return new Error('hotelId is not a number');
    }
    return hotelId;
}

