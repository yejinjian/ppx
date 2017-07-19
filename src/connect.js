/**
 * Created by tianwu on 2017/3/17.
 */

import Store from './store';
import React from 'react';
/**
 * 目前只包了react版本
 */
class Connect extends React.Component {
	constructor(props) {
		super(props);
		const { filter, Store } = props;
		this.Store = Store;

		const models = typeof filter === 'function' ? filter(Store._store) : Store._store;
		let state = {};
		for (let i in models) {
			state[i] = models[i].state;
		}
		this.state = state;
		this.Store.subscribe((data) => {
			const { filter } = this.props;
			data = filter ? filter(data) : data;
			this.setState(data);
		});
	}

	dispatch(action) {
		return this.Store.dispatch(action);
	}

	render() {
		const { View } = this.props;
		const { ...state } = this.state;
		return (<View dispatch={this.dispatch.bind(this)} {...state} />);
	}
}

export default (filter) => {
	return (View) => {
		return function () {
			return (<Connect Store={Store} View={View} filter={filter}/>);
		};
	};
}