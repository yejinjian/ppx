/**
 * Created by tianwu on 2017/3/17.
 */

import React from 'react';
import Provider from './provider';

export default (models) => {
    return (View) => {
        return function(props) {
            return (<Provider models={models} {...props} >
                <View/>
            </Provider>);
        };
    };
}