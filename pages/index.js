import fetch from 'isomorphic-unfetch'

export default class IndexPage extends React.Component {

	static async getInitialProps ({query}) {
		try {
			const url = `http://localhost:3001/api/kittens`;
			const response = await fetch(url);
			const kittensJson = await response.json();
			return { kittens: kittensJson };
		}
		catch (err) {
			return { error: 'Could not load kittens' }
		}
	};

	render () {

		const kittenList = this.props.kittens ? this.props.kittens.map((kitten, key) => <div key={key}>{kitten.name}</div>) : [];

		return <div>
			<h1>Kittens</h1>
			{kittenList}
		</div>
	};

}