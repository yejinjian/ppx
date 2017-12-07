/**
 * Created by tianwu on 2017/3/17.
 */

import React from 'react';
import Provider from './provider';

export default (models, force) => {
    return (View) => {
        return function(props) {
            const { children, ...other } = props;
            return (<Provider models={models} force={force} {...other} >
                <View>{children}</View>
            </Provider>);
        };
    };
}