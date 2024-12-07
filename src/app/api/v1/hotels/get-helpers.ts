import { type NextRequest } from "next/server";



export interface QueriedHotel {
    id: number;
    name: string;
    webLink: string | null;
    address: string;
    email: string;
    status: number;
    coordinate: string;
}

export interface QueryHotelResponse {
    hotels: QueriedHotel[];
}


export interface QueryHotelRequest{
    lat: number;
    lng: number;
}

export function ParseQueryHotelRequest(request: NextRequest): QueryHotelRequest | Error {
    const latStr = request.nextUrl.searchParams.get("lat");
    const lngStr = request.nextUrl.searchParams.get("lng");
    if (!latStr) {
        return new Error('missing lat');
    }
    if (!lngStr) {
        return new Error('missing lng');
    }
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if(isNaN(lat)){
        return new Error('Invalid Latitude');
    }
    if(isNaN(lng)){
        return new Error('Invalid Longitude');
    }
    return {
        lat,
        lng,
    };
}
