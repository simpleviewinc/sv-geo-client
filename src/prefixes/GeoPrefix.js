const { query, nullToUndefined } = require("@simpleview/sv-graphql-client");

class GeoPrefix {
	constructor({ graphUrl, graphServer }) {
		this.name = "geo";
		
		this._graphUrl = graphUrl;
		this._graphServer = graphServer;
	}
	async ip_to_geo({ ip, fields, context }) {
		context = context || this._graphServer.context;
		
		const result = await query({
			query : `
				query($ip: String!) {
					geo {
						ip_to_geo(ip: $ip) {
							${fields}
						}
					}
				}
			`,
			variables : {
				ip
			},
			url : this._graphUrl,
			token : context.token,
			timeout : context.timeout
		});
		
		const returnData = result.geo.ip_to_geo;
		
		nullToUndefined(returnData);
		
		return returnData;
	}
	async _generic(method, { fields, context }) {
		context = context || this._graphServer.context;
		
		const result = await query({
			query : `
				query {
					geo {
						${method} {
							${fields}
						}
					}
				}
			`,
			url : this._graphUrl,
			token : context.token
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