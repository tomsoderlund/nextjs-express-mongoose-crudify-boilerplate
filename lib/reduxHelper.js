import { Provider, connect } from 'react-redux';

// From https://github.com/reactjs/react-redux/issues/390#issuecomment-221389608
export function connectWithStore(store, WrappedComponent, ...args) {
	var ConnectedWrappedComponent = connect(...args)(WrappedComponent)
	return function (props) {
		return <ConnectedWrappedComponent {...props} store={store} />
	}
};