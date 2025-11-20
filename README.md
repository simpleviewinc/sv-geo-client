# sv-geo-client

Client for communication with the `sv-geo` GraphQL system.

It is built in JavaScript and has one peer dependency of `@simpleview/sv-graphql-client`.

## OS Support

The expectation is that this application will be installed in Linux using [sv-kubernetes](https://github.com/simpleviewinc/sv-kubernetes/).

## Prerequisites

* [sv-graphql-client](https://github.com/simpleviewinc/sv-graphql-client/)

## Install

Using npm:
```bash
npm install @simpleview/sv-geo-client
```

Using yarn:
```bash
yarn install @simpleview/sv-geo-client
```

## Update

To update to the latest version, rerun the install command.

## Authentication Requirements

Interactions with `sv-geo` require authentication as a Simpleview user.

Use a Google Service Account when interacting with the service on behalf of a product.

```js
const { AuthPrefix } = require("@simpleview/sv-auth-client");
const { GraphServer } = require("@simpleview/sv-graphql-client");

async function serviceAccountToken() {
	const service_account = JSON.parse(SERVICE_ACCOUNT_JSON);

	const { auth } = new GraphServer({
		graphUrl: AUTH_GRAPHQL_URL,
		prefixes: [AuthPrefix]
	});

	// authorise the service_account return the token
	const { token } = await auth.login_service_account({
		input: {
			email: service_account.client_email,
			private_key: service_account.private_key
		},
		fields: `
			success
			token
		`
	});

	return token;
}
```

The `token` should be added to the `context` for each function call.

## Implementation & Usage

To see the input parameters and output fields of an endpoint, view the Schema in the GraphQL Explorer at https://graphql.simpleviewinc.com/ for the corresponding GraphQL query.

## GeoPrefix

`GeoPrefix` can be loaded into the `sv-graphql-client` `GraphServer` to use as a client library for accessing `geo` in GraphQL.

JavaScript:
```js
const { GeoPrefix } = require("@simpleview/sv-geo-client");
const { GraphServer } = require("@simpleview/sv-graphql-client");

module.exports = new GraphServer({ graphUrl: GRAPHQL_URL, prefixes: [GeoPrefix] });
```

TypeScript:
```ts
import { GeoPrefix } from "@simpleview/sv-geo-client";
import { GraphServer } from "@simpleview/sv-graphql-client";

export default new GraphServer({ graphUrl: GRAPHQL_URL, prefixes: [GeoPrefix] });
```

Where you are making server requests:

JavaScript:
```js
const { geo } = require("./geoGraphServer");
```

TypeScript:
```ts
import { geo } from "./geoGraphServer";
```

### GeoPrefix.ip_to_geo

This method wraps the `geo.ip_to_geo` GraphQL query.

Returns the location information based on the passed in IP address. The accuracy is in km, with MaxMind stating that they have a 67% confidence that the location of the end-user falls within the area defined by the accuracy radius and the latitude and longitude coordinates.

Different locations will return different amounts of data. Some queries may be able to return country, region, city, postal, and metro, while others may only be able to return the city.

Results are cached for 5 minutes with an LRU cache (max 5000 entries).

```js
const result = await geo.ip_to_geo({
	ip: "8.8.8.8",
	fields: `
		success
		message
		doc {
			country_code
			country_name
			region_code
			region_name
			city_code
			city_name
			metro_code
			postal_code
			latitude
			longitude
			accuracy
		}
	`,
	context: {
		token // from serviceAccountToken call
	}
});
```

### GeoPrefix.countries

This method wraps the `geo.countries` GraphQL query.

Returns all known countries according to the MaxMind database. Sorted by country name.

```js
const result = await geo.countries({
	fields: `
		count
		docs {
			id
			name
			code
		}
	`,
	context: {
		token // from serviceAccountToken call
	}
});
```

### GeoPrefix.regions

This method wraps the `geo.regions` GraphQL query.

Returns all known regions for all countries in the MaxMind database. Sorted by region name.

```js
const result = await geo.regions({
	fields: `
		count
		docs {
			id
			name
			code
			country_code
		}
	`,
	context: {
		token // from serviceAccountToken call
	}
});
```

### GeoPrefix.cities

This method wraps the `geo.cities` GraphQL query.

Returns all known cities for all countries in the MaxMind database. Not all cities will have a region. Sorted by city name.

```js
const result = await geo.cities({
	fields: `
		count
		docs {
			id
			name
			code
			country_code
			region_code
		}
	`,
	context: {
		token // from serviceAccountToken call
	}
});
```

### GeoPrefix.metros

This method wraps the `geo.metros` GraphQL query.

Returns the Nielsen Designated Marketing Areas. These are sub-regions of the US that span across state lines, allowing marketers to target areas like the Washington DC metro area which spans across cities and states. The region_codes represent the states that DMA is valid for. Sorted by metro name.

```js
const result = await geo.metros({
	fields: `
		count
		docs {
			id
			name
			code
			country_code
			region_codes
		}
	`,
	context: {
		token // from serviceAccountToken call
	}
});
```

## Related Documentation

* [sv-graphql-client](https://github.com/simpleviewinc/sv-graphql-client/)
* [sv-geo](https://github.com/simpleviewinc/sv-geo/)

## Troubleshooting

For any assistance please reach out on the [Microservices Support](https://teams.microsoft.com/l/channel/19%3A78cf02f015c543748f2488a4742290f1%40thread.tacv2/Microservices%20Support?groupId=42dd24e6-f6ae-4520-9092-cc21b3b3b730&tenantId=cc1eb3c2-fc0c-4a83-8e6a-8d886b4faeab) Teams channel.
