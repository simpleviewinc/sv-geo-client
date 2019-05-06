# sv-geo-client

Client for communicating with sv-geo.

# Package API

## GeoPrefix

`GeoPrefix` can be loaded into the `sv-graphql-client` `GraphServer` to use as a client library for accessing `admin` in GraphQL.

```js
const { GeoPrefix } = require("@simpleview/sv-geo-client");
const { GraphServer } = require("@simpleview/sv-graphql-client");
const graphServer = new GraphServer({ graphUrl : GRAPH_URL, prefixes : [GeoPrefix] });
```

# GraphQL Endpoints

## geo_query

- **ip_to_geo**
	- Returns the location information based on the passed in `ip`.
	- See the schema explorer for all of the different keys that can be returned.
	- The accuracy is in km, with MaxMind stating that they have a `a 67% confidence that the location of the end-user falls within the area defined by the accuracy radius and the latitude and longitude coordinates.`
	- Different locations will return different amounts of keys. Some queries may be able to return country, region, city, postal, and metro, while others may only be able to return the city.
	
- **countries**
	- Returns all known countries according to the MaxMind database.
	- Sorted by country name.

- **regions**
	- Returns all known regions for all countries in the MaxMind database.
	- Sorted by region name.

- **cities**
	- Returns all known cities for all countries in the MaxMind database.
	- Not all cities will have a region.
	- Sorted by city name.

- **metros**
	- Returns the Nielsen Designated Marketing Areas. These are sub-regions of the US that span across state lines, allowing marketers to target things the Washington DC metro area which spans across cities and states.
	- The region_codes represent the states that DMA is valid for.
	- Sorted by metro name.