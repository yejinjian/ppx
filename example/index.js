import Store from '../src/index';
import React from 'react';
import ReactDom from 'react-dom';

class Model {
  constructor() {
    this.namespace = 'app';
    this.state = {
      a: 1,
      b: 2
    }
  }

  async add(state) {
    return await {
      ...state,
      a: state.a+1,
    };
  }

  minus(state){
    return {
      ...state,
      a: state.a-1
    }
  }

}

//绑定model
Store.model(Model);
//加载中间件
Store.use(async(next, state, action)=> {
  console.log('plguin start:', state, action);
  const data = await next(state, action);
  console.log('plguin end:', data);
  return data;
});

// //加载中间件
// Store.use(async(next, state, action)=> {
//   console.log('plguin1 start:', state, action);
//   const data = await next(state, action);
//   data.c = 1;
//   console.log('plguin1 end:', data);
//   return "111";
// });

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
    dispatch({type: 'app/minus'});
  }

  render() {
    const {page} = this.props;
    console.log(page);
    const {a} = page;
    return (
      <div>
        <p>a: {a}</p>
        <a onClick={this.handleAdd.bind(this)}>增加</a>
        <a onClick={this.handleMinus.bind(this)}>减少</a>
      </div>
    );
  }
}

const TestDom = Store.connect(({app})=>{
  return {page:app}
})(Test);
ReactDom.render((<TestDom />),document.getElementById("main"));