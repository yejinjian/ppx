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
  
## 接入说明

model引用
```
    import Store from 'ppx';
    class App {
        constructor() {
            this.state = {
              a: 1,
              b: 2
            };
        }
        test(state, action){
            return {
                ...state,
                aciton.test
            }
        }
        post (state, action){
            return Ajax(action.url).then(function(rep){
                return {
                    ...state,
                    a: rep.a
                }
            })
        }
    }
    Store.model(App);
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

export default connect(['App'])(Test);
```
## todo:
* 当一个view绑定多个model时 是否需要默认model
* reduce中是存在多种返回时：比如请求当成功时给成功提示，失败给失败提示，但是有使用失败给成功结果，失败提示， 目前初步定为用中间件去解决这类问题
* subscribe 性能调优


## 感谢：
* 感谢 [darrenscerri](https://gist.github.com/darrenscerri/5c3b3dcbe4d370435cfa) 提供的异步中间件思路
* 本库的flux思路类似于[dva](https://github.com/dvajs/dva), 只是有别与dva的redux与redux-saga的思路 ppx使用更加简单
* 感谢离职同事的贡献，所以本库任性的按照他的绰号取名
