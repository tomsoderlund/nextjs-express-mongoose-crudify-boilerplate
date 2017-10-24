import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import reduxApi from '../lib/reduxApi'; // our redux-rest object
import { connectWithStore } from '../lib/reduxHelper';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reduxApi.reducers);
const store = createStoreWithMiddleware(reducer);

const mapStateToProps = (state) => ({ kittens: state.kittens });

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

		const afterRestRequest = function (err, results) {
			console.log('POST 2', err, results);
		};

		console.log('POST 1', JSON.stringify(newKitten));
		this.props.dispatch(reduxApi.actions.kittens.post({}, { body: JSON.stringify(newKitten) }, afterRestRequest));
	}

	handleUpdate (index, kittenId, event) {
		const newKitten = {
			name: prompt('New kitten name?'),
		};

		const afterRestRequest = function (err, results) {
			console.log('PUT 2', err, results);
		};

		console.log('PUT 1', index, kittenId, JSON.stringify(newKitten));
		this.props.dispatch(reduxApi.actions.kittens.put({ id: kittenId }, { body: JSON.stringify(newKitten) }, afterRestRequest));
	}

	handleDelete (index, kittenId, event) {

		const afterRestRequest = function (err, results) {
			console.log('DELETE 2', err, results);
		};

		console.log('DELETE 1', index, kittenId);
		this.props.dispatch(reduxApi.actions.kittens.delete({ id: kittenId }, afterRestRequest));
	}

	componentDidMount() {
		const {dispatch} = this.props;

		// Specify id for GET: /api/kittens/59c9743888a7e95e93c3bbea
		//dispatch(reduxApi.actions.oneKitten({ id: '59c9743888a7e95e93c3bbea' }));

		// Fetch all /api/kittens
		dispatch(reduxApi.actions.kittens.sync());
	}

	render () {

		const {kittens} = this.props;

		const kittenList = kittens.data ? kittens.data.map((kitten, index) =>
			<div key={index}>
				{kitten.name} 
				<a className="update" onClick={this.handleUpdate.bind(this, index, kitten._id)}>Update</a>
				<a className="delete" onClick={this.handleDelete.bind(this, index, kitten._id)}>Delete</a>
				<style jsx>{`
					a {
						margin-left: 0.5em;
						cursor: pointer;
						font-size: 0.6em;
						text-transform: uppercase;
					}
					a.update {
						color: lime;
					}
					a.delete {
						color: tomato;
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

const IndexPageConnected = connectWithStore(store, IndexPage, mapStateToProps);
export default IndexPageConnected;
