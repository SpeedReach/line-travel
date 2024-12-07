import { db } from '@/db';
import { hotels } from '@/db/schema';
import { NextRequest, NextResponse } from 'next/server';
import { File } from 'node:buffer'
import { BatchImportResponse, ParseFile, ReadHotelRecords, Transform } from './helpers';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit


export async function POST(request: NextRequest): Promise<NextResponse<BatchImportResponse>> {
    const file = await ParseFile(request, MAX_FILE_SIZE);
    if (file instanceof Error) {
        return new NextResponse(JSON.stringify({ error: file.message }), { status: 400 });
    }
    const records = await ReadHotelRecords(file);
    if (records instanceof Error) {
        return new NextResponse(JSON.stringify({ error: records.message }), { status: 400 });
    }
    try{
        const results = await db.insert(hotels).values(records.map(Transform)).$returningId();
        return new NextResponse(JSON.stringify({ ids: results.map((result) => result.id) }), { status: 201 });
    }
    catch (error){
        console.error(error);
        return new NextResponse(JSON.stringify({ error: 'Failed to import records' }), { status: 500 });
    }
}
