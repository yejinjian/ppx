import React from 'react';
import { connect } from '../../src/index';

@connect()
class Test extends React.Component {
  constructor(props,context) {
    super(props,context);
  }

  handleAdd(e) {
    const {dispatch} = this.props;
    dispatch({type: 'App/add'});
  }

  handleDel(e) {
    const {dispatch} = this.props;
    dispatch({type: 'App/minus'});
  }

  render() {
    const {App} = this.props;

    const {a} = App;
    return (
      <div>
        <p>a:{a}</p>
        <a onClick={this.handleAdd.bind(this)}>增加</a>
        <a onClick={this.handleDel.bind(this)}>减少</a>
      </div>
    );
  }
}

export default Test;
