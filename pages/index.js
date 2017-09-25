import fetch from 'isomorphic-unfetch'

export default class IndexPage extends React.Component {

	static async getInitialProps ({req, res, query}) {
		try {
			const url = `${req.headers.referer}api/kittens`;
			const response = await fetch(url);
			const kittensJson = await response.json();
			return { apiUrl: url, kittens: kittensJson };
		}
		catch (err) {
			return { error: 'Could not load kittens' }
		}
	};

	constructor(props) {
		super(props)
		this.state = { name: '' }
	}

	handleChange (event) {
		this.setState({ name: event.target.value });
	}

	handleAdd (event) {
		fetch(this.props.apiUrl, {
			method: 'POST',
			body: JSON.stringify({
				name: this.state.name,
			}),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
		.then(results => console.log('Fetch results', results))
		.catch(err => console.error('Fetch error', err));
	}

	render () {

		const kittenList = this.props.kittens ? this.props.kittens.map((kitten, key) => <div key={key}>{kitten.name}</div>) : [];

		return <div>
			<h1>Kittens</h1>
			{kittenList}
			<input value={this.state.name} onChange={this.handleChange.bind(this)} placeholder='Enter a kitten name'/>
			<button onClick={this.handleAdd.bind(this)}>Add kitten</button>
		</div>
	};

}