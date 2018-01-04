/**
 * Created by tianwu on 2017/3/17.
 */

import React from 'react';
import Store from './store';
import Provider from './provider';

export default (models, force = false) => (View) => (props, context) => {
    const { children, ...other } = props;
    // 这个是否需要,无法传递下去
    if (View) {
        View.prototype.dispatch = Store.dispatch.bind(View);
    }
    return (<Provider models={models} force={force} {...other} >
        <View>{children}</View>
    </Provider>);
}