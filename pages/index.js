import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';
import reduxApi from '../lib/reduxApi'; // our redux-rest object

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reduxApi.reducers);
const store = createStoreWithMiddleware(reducer);

function mapStateToProps(state) {
	return { kittens: state.kittens };
}

class IndexPage extends React.Component {

	static propTypes = {

		// oneKitten: PropTypes.shape({
		// 	loading: PropTypes.bool.isRequired,
		// 	data: PropTypes.shape({
		// 		text: PropTypes.string
		// 	}).isRequired
		// }).isRequired,

		kittens: PropTypes.shape({
			loading: PropTypes.bool.isRequired,
			data: PropTypes.array.isRequired
		}).isRequired,

		dispatch: PropTypes.func.isRequired
		
	};

	constructor (props) {
		super(props)
		this.state = { name: '', kittens: props.kittens }
	}

	handleChange (event) {
		this.setState({ name: event.target.value });
	}

	handleAdd (event) {
		const newKitten = {
			name: this.state.name,
		};
		const updateLocalKittenState = function (results) {
			console.log('POST', results);
			this.setState({ name: '', kittens: this.state.kittens.concat(newKitten) });
		};
		// POST on API
		fetch(this.props.apiUrl, {
			method: 'POST',
			body: JSON.stringify(newKitten),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(updateLocalKittenState.bind(this))
		.catch(err => console.error('POST error', err));			
	}

	handleDelete (index, kittenId, event) {
		const updateLocalKittenState = function (results) {
			console.log('DELETE', results);
			this.setState({ kittens: this.state.kittens.filter(function (kitten) { return kitten._id !== kittenId }) });
		};
		// DELETE on API
		fetch(this.props.apiUrl + '/' + kittenId, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(updateLocalKittenState.bind(this))
		.catch(err => console.error('DELETE error', err));
	}

	componentDidMount() {
		console.log('this.props', this.props);
		const {dispatch} = this.props;
		// fetch /api/kittens
		dispatch(reduxApi.actions.kittens.sync());
		// specify id for GET: /api/kittens/59c9743888a7e95e93c3bbea
		//dispatch(reduxApi.actions.oneKitten({ id: '59c9743888a7e95e93c3bbea' }));
	}

	render () {

		const {kittens} = this.props;

		const kittenList = kittens.data ? kittens.data.map((kitten, index) =>
			<div key={index}>
				{kitten.name} 
				<a onClick={this.handleDelete.bind(this, index, kitten._id)}>x</a>
				<style jsx>{`
					a {
						color: tomato;
						margin-left: 0.5em;
						cursor: pointer;
					}
				`}</style>
			</div>
		) : [];

		return <div>
			<Head>
				<title>Next.js (React) + Express REST API + MongoDB + Mongoose-Crudify boilerplate</title>
				<meta name="description" content="Demo of nextjs-express-mongoose-crudify-boilerplate"/>
				<meta charSet="utf-8"/>
				<meta name="viewport" content="initial-scale=1.0, width=device-width"/>
				<link rel="stylesheet" href="/static/app.css"/>
			</Head>
			<h1>Kittens</h1>
			{kittenList}
			<div>
				<input value={this.state.name} onChange={this.handleChange.bind(this)} placeholder='Enter a kitten name'/>
				<button onClick={this.handleAdd.bind(this)}>Add kitten</button>
				<style jsx>{`
					div {
						margin-top: 1em;
					}
				`}</style>
			</div>
		</div>
	};

}

// From https://github.com/reactjs/react-redux/issues/390#issuecomment-221389608
function connectWithStore(store, WrappedComponent, ...args) {
	var ConnectedWrappedComponent = connect(...args)(WrappedComponent)
	return function (props) {
		return <ConnectedWrappedComponent {...props} store={store} />
	}
}

const IndexPageConnected = connectWithStore(store, IndexPage, mapStateToProps);

export default IndexPageConnected;
