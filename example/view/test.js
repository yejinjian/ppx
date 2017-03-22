import React from 'react';
import {connect} from '../../src/index';

class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAdd(e) {
    const {dispatch} = this.props;
    dispatch({type: 'app/add'});
  }
  handleDel(e) {
    const {dispatch} = this.props;
    dispatch({type: 'app/del'});
  }

  render() {
    const {page} = this.props;
    console.log(page);
    const {a} = page;
    return (
      <div>
        <p>a: {a}</p>
        <a onClick={this.handleAdd.bind(this)}>增加</a>
        <a onClick={this.handleDel.bind(this)}>减少</a>
      </div>
    );
  }
}

export default connect(({app})=>{
  return {page:app}
})(Test);