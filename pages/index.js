import fetch from 'isomorphic-unfetch'

import React from 'react';
import PropTypes from 'prop-types';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import reduxApi from '../lib/reduxApi'; // our redux-rest object
import { connectComponentWithStore } from '../lib/reduxApi';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reduxApi.reducers);
const store = createStoreWithMiddleware(reducer);

const mapStateToProps = (state) => ({ kittens: state.kittens });

import PageHead from '../components/PageHead';
import KittenItem from '../components/KittenItem';

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

	componentDidMount() {
		const {dispatch} = this.props;

		// Specify id for GET: /api/kittens/59c9743888a7e95e93c3bbea
		//dispatch(reduxApi.actions.oneKitten({ id: '59c9743888a7e95e93c3bbea' }));

		// Fetch all /api/kittens
		dispatch(reduxApi.actions.kittens.sync());
	}

	handleAdd (event) {
		// Progress indicator
		this.setState({ inProgress: true });
		const callbackWhenDone = () => this.setState({ name: '', inProgress: null });

		// Actual data request
		const newKitten = {
			name: this.state.name,
		};
		this.props.dispatch(reduxApi.actions.kittens.post({}, { body: JSON.stringify(newKitten) }, callbackWhenDone));
	}

	handleUpdate (index, kittenId, event) {
		// Progress indicator
		this.setState({ inProgress: kittenId });
		const callbackWhenDone = () => this.setState({ inProgress: null });

		// Actual data request
		const newKitten = {
			name: prompt('New name?'),
		};
		this.props.dispatch(reduxApi.actions.kittens.put({ id: kittenId }, { body: JSON.stringify(newKitten) }, callbackWhenDone));
	}

	handleDelete (index, kittenId, event) {
		// Progress indicator
		this.setState({ inProgress: kittenId });
		const callbackWhenDone = () => this.setState({ inProgress: null });

		// Actual data request
		this.props.dispatch(reduxApi.actions.kittens.delete({ id: kittenId }, callbackWhenDone));
	}

	render () {

		const {kittens} = this.props;

		const kittenList = kittens.data
			? kittens.data.map((kitten, index) => <KittenItem kitten={kitten} index={index} key={index} inProgress={this.state.inProgress} handleUpdate={this.handleUpdate.bind(this)} handleDelete={this.handleDelete.bind(this)}/>)
			: [];

		return <div>
			<PageHead
				title='Next.js (React) + Express REST API + MongoDB + Mongoose-Crudify boilerplate'
				description='Demo of nextjs-express-mongoose-crudify-boilerplate'
			/>

			<h1>Kittens</h1>

			{kittenList}
			<div>
				<input placeholder='Enter a kitten name' value={this.state.name} onChange={this.handleChange.bind(this)} disabled={this.state.inProgress}/>
				<button onClick={this.handleAdd.bind(this)} disabled={this.state.inProgress}>Add kitten</button>
				<style jsx>{`
					div {
						margin-top: 1em;
					}
				`}</style>
			</div>

		</div>
	};

}

const IndexPageConnected = connectComponentWithStore(IndexPage, store, mapStateToProps);
export default IndexPageConnected;
