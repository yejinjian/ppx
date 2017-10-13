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
		const { filter } = props;
		this.Store = Store;

		const models = typeof filter === 'function' ? filter(Store._store) : Store._store;
		let state = {};
		for (let i in models) {
			state[i] = models[i].state;
		}
		this.state = state;
		this.subscribe();
	}

	/**
	 * 监听store 变化
	 */
	subscribe(){
		this.Store.subscribe((data) => {
			const { filter} = this.props;
			data = filter ? filter(data) : data;
			if(data){
				this.setState(data);
			}
		});
	}

	dispatch(action) {
		return this.Store.dispatch(action);
	}

	render() {
		const { View, filter, children, ...others } = this.props;
        console.log(this.props);
		const { ...state } = this.state;
		return (<View dispatch={this.dispatch.bind(this)} {...state} {...others} />);
	}
}

export default (filter) => {
	return (View) => {
		return function (props) {
			return (<Connect {...props} View={View} filter={filter}/>);
		};
	};
}