import 'isomorphic-fetch';
import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

export default reduxApi({

	// Simple endpoint description
	//oneKitten: '/api/kittens/59c9743888a7e95e93c3bbea',

	// Complex endpoint description
	kittens: {
		url: '/api/kittens',
		// reimplement default `transformers.object`
		transformer: transformers.array,
		// base endpoint options `fetch(url, options)`
		// options: {
		// 	headers: {
		// 		'Accept': 'application/json'
		// 	}
		// }
	}

}).use('fetch', adapterFetch(fetch)); // it's necessary to point using REST backend
