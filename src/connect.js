/**
 * Created by tianwu on 2017/3/17.
 */

import Store from './store';
import React from 'react';

class Connect extends React.Component {
  constructor(props) {
    super(props);
    const {filter, Store} = props;
    this.Store = Store;

    const models = typeof  filter == 'function' ? filter(Store._store) : Store._store;
    console.log(Store._store);
    let state = {};
    for (var i in models) {
      state[i] = models[i].state;
    }
    this.state = state;
  }

  dispatch(action) {
    return this.Store.dispatch(action).then((data)=> {
      const filter = this.props.filter;
      data = filter?filter(data):data;
      this.setState(data);
    })
  }

  render() {
    const {View} = this.props;
    const {...state} = this.state;
    return (<View dispatch={this.dispatch.bind(this)} {...state} />)
  }
}

export default (filter) => {
  return (View)=> {
    return function () {
      return (<Connect Store={Store} View={View} filter={filter}/>)
    };
  }
}