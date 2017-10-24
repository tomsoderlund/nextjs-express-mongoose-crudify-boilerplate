import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

// Consider replacing redux-api with https://github.com/agraboso/redux-api-middleware

export default reduxApi({

	// Simple endpoint description
	//oneKitten: '/api/kittens/59c9743888a7e95e93c3bbea',

	// Complex endpoint description
	kittens: {
		url: '/api/kittens/:id',
		crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud
		// reimplement default `transformers.object`
		transformer: transformers.array,
		// base endpoint options `fetch(url, options)`
		options: {
			headers: {
				'Content-Type': 'application/json'
			}
		}
	}

}).use('fetch', adapterFetch(fetch)); // it's necessary to point using REST backend
