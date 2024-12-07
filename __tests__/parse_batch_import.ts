import { describe } from 'node:test';
import { expect, test } from '@jest/globals';
import { readFile, readFileSync } from 'fs';
import { ReadHotelRecords, Transform } from '@/app/api/v1/hotels/batch-import/helpers';
import { File } from 'node:buffer'


describe('ReadHotelRecords', () => {
    test('should fail parse', async () => {
        const buffer = readFileSync('__tests__/broken_hotel_data.csv');
        const file = new File([buffer], 'broken_hotel_data.csv', { type: 'text/csv' });
        const records = await ReadHotelRecords(file);
        expect(records).toBeInstanceOf(Error);
    });
    test('should successfully parse a file', async () => {
        //read file from "hotel_data.csv"
        const buffer = readFileSync('__tests__/hotel_data.csv');
        const file = new File([buffer], 'hotel_data.csv', { type: 'text/csv' });
        const records = await ReadHotelRecords(file)
        expect(records).not.toBeInstanceOf(Error);
        if(records instanceof Error){
            throw records;
        }
        expect(records).toHaveLength(7);
        expect(records[0]).toEqual({
            name: '礁溪老爺酒店',
            address: '五峰路69號',
            email: 'https://www.hotelroyal.com.tw',
            country: '台灣',
            city: '宜蘭',
            longitude: 121.776,
            latitude: 24.671,
            is_open: true
        });
        expect(records[1]).toEqual({
            name: '碁宏',
            address: '16702 新營新北投街87號之3',
            email: 'info@碁宏.com',
            country: '台灣',
            city: '中和',
            longitude: 120.732917,
            latitude: 24.033516,
            is_open: false
        });
        expect(records[2]).toEqual({
            name: '大八電視股份有限公司',
            address: '82373 台東大坪巷5號之1',
            email: 'info@大八電視股份有限公司.com',
            country: '台灣',
            city: '古坑',
            longitude: 121.21804,
            latitude: 24.336702,
            is_open: true
        });
        expect(records[3]).toEqual({
            name: '台灣BIM有限公司',
            address: '208 草屯大勇街538號4樓',
            email: 'info@台灣bim有限公司.com',
            country: '台灣',
            city: '中壢',
            longitude: 121.429917,
            latitude: 23.325581,
            is_open: true
        });
        expect(records[4]).toEqual({
            name: '旗花（台灣銀）行有限公司',
            address: '577 竹田縣東湖巷6號之6',
            email: 'info@旗花（台灣銀）行有限公司.com',
            country: '台灣',
            city: '蘆洲',
            longitude: 121.991148,
            latitude: 23.546168,
            is_open: false
        });
        expect(records[5]).toEqual({
            name: '雄遠建設事業有限公司',
            address: '46907 臺東縣建國巷7號9樓',
            email: 'info@雄遠建設事業有限公司.com',
            country: '台灣',
            city: '桃園',
            longitude: 120.924688,
            latitude: 24.105099,
            is_open: false
        });
        expect(records[6]).toEqual({
            name: '台灣軟微股份有限公司',
            address: '288 馬公市西門路699號之2',
            email: 'info@台灣軟微股份有限公司.com',
            country: '台灣',
            city: '牡丹',
            longitude: 120.749185,
            latitude: 23.358219,
            is_open: false
        });
    });
});



describe('Transform', () => {
    test('should transform a CSVHotelRecord to a HotelRecord', () => {
        const record = {
            name: '礁溪老爺酒店',
            address: '五峰路69號',
            email: 'https://www.hotelroyal.com.tw',
            country: '台灣',
            city: '宜蘭',
            longitude: 121.776,
            latitude: 24.671,
            is_open: true
        };
        const transformed = Transform(record);
        expect(transformed).toEqual({
            name: '礁溪老爺酒店',
            address: '五峰路69號,台灣,宜蘭',
            email: 'https://www.hotelroyal.com.tw',
            status: 1,
            coordinate: '121.776,24.671',
            h3Index: '874ba15a5ffffff'
        });
    });

});