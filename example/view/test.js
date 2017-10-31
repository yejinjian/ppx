import React from 'react';
import {connect} from '../../src/index';

class Test extends React.Component {
  constructor(props,context) {
    super(props,context);
  }

  handleAdd(e) {
    const {dispatch} = this.props;
    dispatch({type: 'app/add'});
  }
  handleDel(e) {
    const {dispatch} = this.props;
    dispatch({type: 'app/minus'});
  }

  render() {
    const {page} = this.props;
    const {a} = page;
    return (
      <div>
        <p>a:{a}</p>
        <a onClick={this.handleAdd.bind(this)}>增加</a>
        <a onClick={this.handleDel.bind(this)}>减少</a>
      </div>
    );
  }
}

export default connect(({app})=>{
  return {page:app}
})(Test);