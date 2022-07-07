const { query, nullToUndefined } = require("@simpleview/sv-graphql-client");
const pMemoize = require("p-memoize");

class GeoPrefix {
	constructor({ graphUrl, graphServer }) {
		this.name = "geo";

		this._graphUrl = graphUrl;
		this._graphServer = graphServer;
	}

	async ip_to_geo({
		ip,
		fields,
		timeout = 5000,
		context
	}) {
		context = context || this._graphServer.context;

		const getGeoForIp = async (graphUrl, ip, fields, token, timeout) => {
			const result = await query({
				query: `
					query($ip: String!) {
						geo {
							ip_to_geo(ip: $ip) {
								${fields}
							}
						}
					}
				`,
				variables: {
					ip
				},
				url: graphUrl,
				token: token,
				timeout
			});

			const returnData = result.geo.ip_to_geo;

			nullToUndefined(returnData);

			return returnData;
		}

		const geo_data = pMemoize(getGeoForIp, {
			cacheKey: _ => JSON.stringify({ ip, fields })
		});

		return await geo_data(this._graphUrl, ip, fields, context.token, timeout);
	}
	async _generic(method, {
		fields,
		timeout = 5000,
		context
	}) {
		context = context || this._graphServer.context;

		const result = await query({
			query: `
				query {
					geo {
						${method} {
							${fields}
						}
					}
				}
			`,
			url: this._graphUrl,
			token: context.token,
			timeout
		});

		const returnData = result.geo[method];

		nullToUndefined(returnData);

		return returnData;
	}
	async countries(args) {
		return this._generic("countries", args);
	}
	async regions(args) {
		return this._generic("regions", args);
	}
	async cities(args) {
		return this._generic("cities", args);
	}
	async metros(args) {
		return this._generic("metros", args);
	}
}

module.exports = GeoPrefix;