# Line Travel
This is the assignment for line travel.


## Api Doc


| Path | Method | Params | Body | Response | Content Type | Description |
| --- | --- | --- | --- | --- | --- | --- |
| api/v1/hotels | GET | lat: number, lng: number | | { hotels: Hotel[] } | application/json | Get hotels around the latlng. |
| api/v1/hotels | POST | | {name: string,webLink: string?,address: string,email: string,status: number,lng: number,lat: number} | { id: number } | application/json | Create a hotel and retuns the created hotel id. 201 success |
| api/v1/hotels/:id | PUT | | same as POST |  | application/json | Update a hotel. 404 if not found, 200 success |
| api/v1/hotels/:id | DELETE | | | | application/json | Delete a hotel. 404 if not found, 200 success |
| api/v1/hotels/batch-import | POST | | file(csv)  | {ids: number[]} (json) | form-data | Batch import hotels from csv file. |


## Query Design
There are generally two ways to search for hotels. The first is full text search, and the second is range searching based on latitude and longitude coordinates. The second method is most common in travel services because we usually decide on a destination first and then search for nearby hotels, rarely searching for hotels directly by name.
These two types of searches each have their suitable indexes. For full text search, you can use MySQL's built-in FULLTEXT index, or if you need more complex full text search capabilities, I would switch to using Elasticsearch. For latitude/longitude queries, I would use the uber-h3 index. Since this is just an assignment, we'll only implement the latitude/longitude search for now.

Read more about h3 index here: https://h3geo.org . (In short: Given a resolution and latitude/longitude coordinates, H3 can calculate a h3_index.)

The approach here is to first calculate the latitude and longitude coordinates of hotels, then compute their H3 indexes at different resolutions and store them in the database. When performing a search, we select an appropriate resolution based on the search radius, and query the database accordingly. This way, the search complexity becomes log(n).
For simplicity, we select only use one resolution in this assignment.


## Testing

This assignment requires using Jest for unit testing. My understanding of backend unit testing is as follows: it should not require additional dependencies such as external services or databases. Testing should focus on individual units, which I consider to be single classes or functions.  
This means that unit tests won't test SQL language or ORM parts. To avoid unnecessary testing and mocking, all my backend handlers components are pure functions except for SQL language and ORM components, and unit tests will only be testing these pure functions. SQL language and ORM should be tested in integration tests, but since this assignment doesn't require integration testing, I'll skip that part.
Run unit tests with: `yarn test`.


## Library choices
I used drizzle for it's popularity and database migration.


## Run
docker compose up --build