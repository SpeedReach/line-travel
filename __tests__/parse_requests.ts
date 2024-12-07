
import { describe } from 'node:test';
import { expect, test } from '@jest/globals';
import { NextRequest } from 'next/server';
import { ParsePostRequest } from '@/app/api/v1/hotels/post-helpers';
import { ParsePutRequest } from '@/app/api/v1/hotels/[id]/put-helpers';
import { ParseQueryHotelRequest } from '@/app/api/v1/hotels/get-helpers';
import { ParseDeleteRequest } from '@/app/api/v1/hotels/[id]/delete-helpers';




describe('ParsePostRequest', () => {
    const postUrl = 'http://localhost:3000/api/v1/hotels';
    const email = 'brian@gmail.com';
    
    test('should return null if request body is empty', async () => {
        const request = {
            body: {}
        } as any;
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request body is missing name', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        )
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return parsed body if only weblink is null', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 92,
                    lat: 0
                }),
            }
        );

        const body = await ParsePostRequest(request);
        if (body instanceof Error) {
            throw body;
        }
        expect(body.name).toBe('Hotel California');
        expect(body.webLink).toBeUndefined();
        expect(body.address).toBe('1234 Main St');
        expect(body.email).toBe(email);
        expect(body.status).toBe(1);
        expect(body.lng).toBe(92);
        expect(body.lat).toBe(0);
    });

    test('should return null if request body is missing address', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    email: email,
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request body is missing email', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return error if lat lng out of range', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 181,
                    lat: 91
                }),
            }
        );
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return parsed body if all fields are present', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );

        const body = await ParsePostRequest(request);
        if (body instanceof Error) {
            throw body;
        }
        expect(body.name).toBe('Hotel California');
        expect(body.webLink).toBe('http://example.com');
        expect(body.address).toBe('1234 Main St');
        expect(body.email).toBe(email);
        expect(body.status).toBe(1);
        expect(body.lng).toBe(0);
        expect(body.lat).toBe(0);
    });

    test('should return error if status is not 0 or 1', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 2,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

    test('should return error if email format not right', async () => {
        const request = new NextRequest(
            postUrl,
            {
                method: 'POST',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: 'brian',
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePostRequest(request)).toBeInstanceOf(Error);
    });

});

describe('ParsePutRequest', () => {
    const putUrl =(id?: Object) => 'http://localhost:3000/api/v1/hotels/' + (id ?? "");
    const email = 'brian@gmail.com';

    test('should return null if request body is empty', async () => {
        const request = new NextRequest(
            putUrl(1),
            {
                method: 'PUT',
                body: JSON.stringify({})
            }
        );
        expect(await ParsePutRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request body is missing id', async () => {
        const request = new NextRequest(
            putUrl(),
            {
                method: 'PUT',
                body: JSON.stringify({
                    name: 'Hotel California',
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePutRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if invalid id', async () => {
        const request = new NextRequest(
            putUrl("DD"),
            {
                method: 'PUT',
                body: JSON.stringify({
                    webLink: 'http://example.com',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 0,
                    lat: 0
                }),
            }
        );
        expect(await ParsePutRequest(request)).toBeInstanceOf(Error);
    });

    test('should return parsed body if only weblink is null', async () => {
        const request = new NextRequest(
            putUrl(22),
            {
                method: 'PUT',
                body: JSON.stringify({
                    name: 'Hotel California',
                    address: '1234 Main St',
                    email: email,
                    status: 1,
                    lng: 92,
                    lat: 0
                }),
            }
        );

        const body = await ParsePutRequest(request);
        if (body instanceof Error) {
            throw body;
        }
        expect(body.id).toBe(22);
        expect(body.name).toBe('Hotel California');
        expect(body.webLink).toBeUndefined();
        expect(body.address).toBe('1234 Main St');
        expect(body.email).toBe(email);
        expect(body.status).toBe(1);
        expect(body.lng).toBe(92);
        expect(body.lat).toBe(0);
    });
});


describe('ParseQueryHotelRequest', () => {
    const getUrl = (lat?: any, lng?: any) => 'http://localhost:3000/api/v1/hotels?lat={lat}&lng={lng}'.replace('{lat}', lat ?? "").replace('{lng}', lng ?? "");

    test('should return null if request query is empty', () => {
        const request = new NextRequest(
            getUrl(),
            {
                method: 'GET'
            }
        );
        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });


    test('should return null if request query is missing lat', () => {
        const request = new NextRequest(
            getUrl(undefined, 0),
            {
                method: 'GET'
            }
        );
        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request query is missing lng', () => {
        const request = new NextRequest(
            getUrl(0),
            {
                method: 'GET'
            }
        );
        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request query is missing lat and lng', () => {
        const request = new NextRequest(
            getUrl(),
            {
                method: 'GET'
            }
        );
        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });

    test('should return parsed query if all fields are present', () => {
        const request = new NextRequest(
            getUrl(5, 80),
            {
                method: 'GET'
            }
        );
        const query = ParseQueryHotelRequest(request);
        if (query instanceof Error) {
            throw query;
        }
        expect(query.lat).toBe(5);
        expect(query.lng).toBe(80);
    });


    test('should return error if lat is not a number', () => {
        const request = new NextRequest(
            getUrl('a', 80),
            {
                method: 'GET'
            }
        );

        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });

    test('should return error if lng is not a number', () => {
        const request = new NextRequest(
            getUrl(80, 'b'),
            {
                method: 'GET'
            }
        );

        expect(ParseQueryHotelRequest(request)).toBeInstanceOf(Error);
    });
});

describe('ParseDeleteRequest', () => {
    const deleteUrl = (id?: any) => 'http://localhost:3000/api/v1/hotels/' + (id ?? "");

    test('should return null if request query is empty', () => {
        const request = new NextRequest(
            deleteUrl(),
            {
                method: 'DELETE'
            }
        );
        expect(ParseDeleteRequest(request)).toBeInstanceOf(Error);
    });

    test('should return null if request query is missing id', () => {
        const request = new NextRequest(
            deleteUrl(),
            {
                method: 'DELETE'
            }
        );
        expect(ParseDeleteRequest(request)).toBeInstanceOf(Error);
    });

    test('should return parsed query if all fields are present', () => {
        const request = ParseDeleteRequest(new NextRequest(
            deleteUrl(5),
            {
                method: 'DELETE'
            }
        ));
        if (request instanceof Error) {
            throw request;
        }
        expect(request).toBe(5);
    });

    test('should return error if id is not a number', () => {
        const request = new NextRequest(
            deleteUrl('a'),
            {
                method: 'DELETE'
            }
        );

        expect(ParseDeleteRequest(request)).toBeInstanceOf(Error);
    });
});

