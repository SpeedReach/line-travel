import { parse } from 'csv-parse/sync';
import { latLngToCell } from 'h3-js';
import { NextRequest, NextResponse } from 'next/server';
import { File } from 'node:buffer'

export async function ParseFile(request: NextRequest,max_file_size :number): Promise<File | Error> {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return new Error('No file uploaded');
    }

    if (file.size > max_file_size) {
        return new Error('File too large. Maximum size is 5MB');
    }

    return file;
}

export interface CSVHotelRecord{
    name: string;
    address: string;
    email: string;
    country: string;
    city: string;
    longitude: number;
    latitude: number;
    is_open: boolean;
}

export interface HotelRecord{
    name: string;
    address: string;
    email: string;
    status: number;
    coordinate: string;
    h3Index: string;
}



export async function ReadHotelRecords(file: File): Promise<CSVHotelRecord[] | Error> {
    try{
        const csvText = await file.text();
        const records = parse(csvText, {
            columns: true,
            skip_empty_lines: true
        });
        if(records.length === 0){
            return new Error('No records in file');
        }
        return records.map((record: any) => {
            return {
                name: record.name,
                address: record.address,
                email: record.email,
                country: record.country,
                city: record.city,
                longitude: parseFloat(record.longitude),
                latitude: parseFloat(record.latitude),
                is_open: record.is_open.toLowerCase() === 'true'
            };
        });
    }
    catch (error){
        return new Error('Invalid CSV file');
    }
}

export function Transform(records: CSVHotelRecord): HotelRecord{
    return {
        name: records.name,
        address: records.address+','+records.country+','+records.city,
        email: records.email,
        status: records.is_open ? 1 : 0,
        coordinate: `${records.longitude},${records.latitude}`,
        h3Index: latLngToCell(records.latitude, records.longitude, 7),
    }
}

export interface BatchImportResponse {
    ids: number[];
}
