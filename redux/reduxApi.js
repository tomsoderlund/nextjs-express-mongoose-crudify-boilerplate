import _ from 'lodash'
import fetch from 'isomorphic-fetch'

import reduxApi, { transformers } from 'redux-api'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { connect } from 'react-redux'

const { config } = require('../config/config')

const apiTransformer = function (data, prevData, action) {
  const actionMethod = _.get(action, 'request.params.method')
  switch (actionMethod) {
    case 'POST':
      return [...prevData, data]
    case 'PUT':
      return prevData.map(oldData => oldData._id === data._id ? data : oldData)
    case 'DELETE':
      return _(prevData).filter(oldData => oldData._id === data._id ? undefined : oldData).compact().value()
    default:
      return transformers.array.call(this, data, prevData, action)
  }
}

// redux-api documentation: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md
const thisReduxApi = reduxApi({

  // Simple endpoint description
  // oneKitten: '/api/kittens/:id',

  // Complex endpoint description
  kittens: {
    url: '/api/kittens/:id',
    crud: true, // Make CRUD actions: https://github.com/lexich/redux-api/blob/master/docs/DOCS.md#crud

    // base endpoint options `fetch(url, options)`
    options: config.jsonOptions,

    // reducer (state, action) {
    //  console.log('reducer', action);
    //  return state;
    // },

    // postfetch: [
    //  function ({data, actions, dispatch, getState, request}) {
    //    console.log('postfetch', {data, actions, dispatch, getState, request});
    //    dispatch(actions.kittens.sync());
    //  }
    // ],

    // Reimplement default `transformers.object`
    // transformer: transformers.array,
    transformer: apiTransformer

  }

})
  .use('fetch', adapterFetch(fetch))
  .use('rootUrl', config.appUrl)

export default thisReduxApi

const createStoreWithThunkMiddleware = applyMiddleware(thunkMiddleware)(createStore)
export const makeStore = (reduxState, enhancer) => createStoreWithThunkMiddleware(combineReducers(thisReduxApi.reducers), reduxState)

// endpointNames: Use reduxApi endpoint names here
const mapStateToProps = (endpointNames, reduxState) => {
  let props = {}
  for (let i in endpointNames) {
    props[endpointNames[i]] = reduxState[endpointNames[i]]
    props[`${endpointNames[i]}Actions`] = thisReduxApi.actions[endpointNames[i]]
  }
  return props
}

export const withReduxEndpoints = (PageComponent, endpointNames) => connect(mapStateToProps.bind(undefined, endpointNames))(PageComponent)
// Define custom endpoints/providers here:
export const withKittens = PageComponent => withReduxEndpoints(PageComponent, ['kittens'])
