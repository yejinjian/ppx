import Store from '../src/index';
import React from 'react';
import ReactDom from 'react-dom';
import Page from './models/page';
import TestDom from './view/test';

//绑定model
Store.model(Page);

//加载中间件
Store.use(async(next, action)=> {
  console.log('plguin start:', action);
  const data = await next(action);
  console.log('plguin end:', data);
  return data;
});

ReactDom.render((<TestDom />),document.getElementById("main"));