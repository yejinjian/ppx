/**
 * Created by tianwu on 2017/3/17.
 */

import Store from './store';
import React from 'react';
/**
 * 目前只包了react版本
 */
export default class Provider extends React.Component {
    constructor(props, context) {
        super(props, context);
        const { models } = props;
        this.models = models instanceof Array ?
            models :
            (typeof models === 'string' ? [models] : null);
        this.state = this.filterState();
        this.subscribe(models);
    }

    filterState() {
        let { _store } = Store;
        const filterStore = Object.assign({}, _store);
        if (this.models) {
            this.models.map((modelKey) => {
                if (_store[modelKey]) {
                    filterStore[modelKey] = _store[modelKey];
                }
            });
        }
        // 过滤state;
        let state = {};
        for (let i in filterStore) {
            state[i] = filterStore[i].state;
        }
        return state;
    }

    /**
     * 监听store 变化
     */
    subscribe() {
        Store.subscribe((action, data) => {
            if (this.models) {
                // 只对关注的models监听
                const [namespace, reduce] = action.type.split('/');
                if (this.models.indexOf(namespace) > -1) {
                    this.setState(data);
                }
                return;
            }
            // 空关注全监听
            if (data) {

                this.setState(data);
            }
        });
    }

    render() {
        const { children, ...others } = this.props;
        const { ...state } = this.state;
        const { dispatch } = Store;
        return React.cloneElement(children, { ...others, dispatch, ...state });
    }
}

