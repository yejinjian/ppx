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
        test: funtion (state,action){
            return {
                ...state,
                aciton.test
            }
        }
        post: function(state,action){
            return Ajax(url).then(function(rep){
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
    
```