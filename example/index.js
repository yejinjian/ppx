import Store from '../src/index';
import React from 'react';
import ReactDom from 'react-dom';
import DiffMid from './middleware/diff';
import Log from './middleware/log';

import Page from './models/page';
import TestDom from './view/test';

//绑定model
Store.model(Page);

//加载中间件
Store.use(DiffMid(true));
Store.use(Log);

ReactDom.render((<TestDom test="1" />),document.getElementById("main"));