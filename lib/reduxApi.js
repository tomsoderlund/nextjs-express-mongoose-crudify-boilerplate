import _ from 'lodash';
import 'isomorphic-fetch';
import reduxApi, { transformers } from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { Provider, connect } from 'react-redux';

// TODO: improve this with proper universal config
const API_URL = process.env.NODE_ENV === 'production' ? 'https://nextjs-express-mongoose.herokuapp.com' : 'http://localhost:3001';

// redux-api documentation: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md
export default reduxApi({

	// Simple endpoint description
	//oneKitten: '/api/kittens/:id',

	// Complex endpoint description
	kittens: {
		url: '/api/kittens/:id',
		crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud

		// base endpoint options `fetch(url, options)`
		options: {
			headers: {
				'Content-Type': 'application/json'
			}
		},

		// reducer (state, action) {
		// 	console.log('reducer', action);
		// 	return state;
		// },

		// postfetch: [
		// 	function ({data, actions, dispatch, getState, request}) {
		// 		console.log('postfetch', {data, actions, dispatch, getState, request});
		// 		dispatch(actions.kittens.sync());
		// 	}
		// ],

		// Reimplement default `transformers.object`
		//transformer: transformers.array,
		transformer: function (data, prevData, action) {
			const actionMethod = _.get(action, 'request.params.method');
			switch (actionMethod) {
				case 'POST':
					return [...prevData, data];
					break;
				case 'PUT':
					return prevData.map(oldData => oldData._id === data._id ? data : oldData);
					break;
				case 'DELETE':
					return _(prevData).filter(oldData => oldData._id === data._id ? undefined : oldData).compact().value();
					break;
				default:
					return transformers.array.call(this, data, prevData, action);
			}
		},

	}

})
.use('fetch', adapterFetch(fetch))
.use('rootUrl', API_URL);
