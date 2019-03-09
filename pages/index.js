import { Component } from 'react'

import reduxApi, { withKittens } from '../redux/reduxApi.js'

import { Link } from '../server/routes.js'
import PageHead from '../components/PageHead'
import KittenItem from '../components/KittenItem'

class IndexPage extends Component {
  static async getInitialProps ({ store, isServer, pathname, query }) {
    // Get all kittens
    const kittens = await store.dispatch(reduxApi.actions.kittens.sync())
    return { kittens, query }
  }

  constructor (props) {
    super(props)
    this.state = { name: '' }
  }

  handleChangeInputText (event) {
    this.setState({ name: event.target.value })
  }

  handleAdd (event) {
    const { name } = this.state
    if (!name) return
    const callbackWhenDone = () => this.setState({ name: '', inProgress: false })
    this.setState({ inProgress: true })
    // Actual data request
    const newKitten = { name }
    this.props.dispatch(reduxApi.actions.kittens.post({}, { body: JSON.stringify(newKitten) }, callbackWhenDone))
  }

  handleUpdate (kitten, index, kittenId, event) {
    const name = window.prompt('New name?', kitten.name)
    if (!name) return
    const callbackWhenDone = () => this.setState({ inProgress: false })
    this.setState({ inProgress: kittenId })
    // Actual data request
    const newKitten = { id: kittenId, name }
    this.props.dispatch(reduxApi.actions.kittens.put({ id: kittenId }, { body: JSON.stringify(newKitten) }, callbackWhenDone))
  }

  handleDelete (index, kittenId, event) {
    const callbackWhenDone = () => this.setState({ inProgress: false })
    this.setState({ inProgress: kittenId })
    // Actual data request
    this.props.dispatch(reduxApi.actions.kittens.delete({ id: kittenId }, callbackWhenDone))
  }

  render () {
    const { kittens } = this.props// dd

    const kittenList = kittens.data
      ? kittens.data.map((kitten, index) => <KittenItem
        key={index}
        kitten={kitten}
        index={index}
        inProgress={this.state.inProgress}
        handleUpdate={this.handleUpdate.bind(this, kitten)}
        handleDelete={this.handleDelete.bind(this)}
      />)
      : []

    return <main>
      <PageHead
        title='Next.js (React) + Express REST API + MongoDB + Mongoose-Crudify boilerplate'
        description='Demo of nextjs-express-mongoose-crudify-boilerplate'
      />

      <h1>Kittens</h1>

      {kittenList}
      <div>
        <input placeholder='Enter a kitten name' value={this.state.name} onChange={this.handleChangeInputText.bind(this)} disabled={this.state.inProgress} />
        <button onClick={this.handleAdd.bind(this)} disabled={this.state.inProgress}>Add kitten</button>
        <style jsx>{`
          div {
            margin-top: 1em;
          }
        `}</style>
      </div>

      <h2>Routing</h2>
      Current page slug: /{this.props.query.slug}
      <ul>
        <li><Link route='/about'><a>About</a></Link></li>
        <li><Link route='/more/contact'><a>Contact</a></Link></li>
      </ul>

    </main>
  };
}

export default withKittens(IndexPage)
