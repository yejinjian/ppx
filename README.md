## 设计概要
ppx(皮皮虾)是一个遵循flux思想的数据管理工具。
* one store 原则
  不同于redux, 我们摒弃reduce 的设计，改用了model的思想，考虑到model与view存在多对多的情况， 统一由一个store管理
* suport middleware
  与redux类同，也支持中间件，因为考虑到异步的缘故，目前是与redux的中间件不同，后期考虑支持redux中间件
* promisefy
  支持promise，不仅是model支持异步，而且中间件也支持异步
* suport react
  依然是flux的思想，那么支持react是必然的，后期考虑支持vue等其他的库

```
 npm install --save ppx
```  
  
##接入说明

model引用
```
    import Store from 'ppx';
    var model = {
        namespace: 'model1',
        test: funtion (action){
            cosnt state = this.state;
            return {
                ...state,
                aciton.test
            }
        }
        post: function(action){
            return Ajax(url).then(function(rep){
                const state = this.state;
                return {
                    ...state,
                    a: rep.a
                }
            })
        }
    }
    Store.model(model);
```

middleware引用
```
    import Store from 'ppx';
    var middleware = (next, action)=>{
      console.log('plugin start:', action);
      const data = await next(action);
      console.log('plugin end:', data);
      return data;
    }
    Store.use(middleware);
```

view 调用

```
import React from 'react';
import {connect} from 'ppx';

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
```

##感谢：
* 感谢 [darrenscerri](https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa) 提供的异步中间件思路
* 本库的flux思路类似于[dva](https://github.com/dvajs/dva), 只是有别与dva的redux与redux-saga的思路 ppx使用更加简单
* 感谢离职同事的贡献，所以本库任性的安装他的绰号取名
