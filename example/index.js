import Store from '../src/index';
import React from 'react';
import ReactDom from 'react-dom';
import DiffMid from './middleware/diff';

import Page from './models/page';
import TestDom from './view/test';

//绑定model
Store.model(Page);

//加载中间件
Store.use(DiffMid(true));
//Store.use(async(next, action)=> {
//  console.log('plugin start:', action);
//  const data = await next(action);
//  console.log('plugin end:', data);
//  return data;
//});

ReactDom.render((<TestDom />),document.getElementById("main"));