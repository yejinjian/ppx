import 'promise-polyfill';
import middleware from './applymiddleware';
import Util  from './util';

//插件用于数据save与返回promise
const plugin = async function(next, action) {
    const ret = await next(action);
    let { state } = this;
    if (ret === undefined) {
        return;
    }
    //更新 state 值
    this.state = Object.assign(state, ret);
    // 修改值
    // triggerSubscribe(action, ret);
    return ret;
};

class Store {
    constructor() {
        this._store = {};
        this._fn = [];
        this.middle = new middleware();
        this.use(plugin);
    }

    /**
     * 获取model对象的namespace
     * @param model
     */
    getRealModel(Model) {
        // 类对象
        let model = Model;
        if (typeof Model === 'function') {
            model = new Model();
        }
        // 获取
        let { namespace, constructor } = model;
        if (constructor && constructor.name) {
            namespace = constructor.name;
        }
        return {
            namespace,
            model
        };
    }

    /**
     * model 支持
     * @param Model
     * @param force 强制新建model
     * @returns {*}
     */
    model(Model, force = false) {
        // 支持多个model的情况
        if (Model instanceof Array) {
            return Model.map((oneModel) => {
                return this.model(oneModel, force);
            });
        }

        if (!Model) {
            throw new Error(`${Model} is undefined`);
        }
        // 类对象
        let model = Model;
        if (typeof Model === 'function') {
            model = new Model();
        }
        // 获取 这个在压缩时有坑
        const {namespace} = model;
        //let { namespace, constructor } = model;
        //if (constructor && constructor.name) {
        //    namespace = constructor.name;
        //}

        if (!namespace) {
            throw new Error(`It is not a model: ${model}`);
        }

        if (!force && this._store[namespace]) {
            // model已存在
            return namespace;
        }

        // save namespace;
        model.namespace = namespace;
        // 不鼓励在model中使用dispatch 但是想来会有复杂需求使用到
        model.dispatch = this._addDispatch(namespace);
        // save
        this._store[namespace] = model;
        // model 触发事件调用 不鼓励使用
        if (typeof model.bootstrap === 'function') {
            Util.defer(model.bootstrap.bind(model));
        }
        return namespace;
    }

    /**
     * 用于 model内部支持dispatch 方法
     * @param namespace
     * @returns {function(*=, ...[*])}
     * @private
     */
    _addDispatch(namespace) {
        return (action, ...params) => {
            if (typeof action === 'string') {
                const type = `${namespace}/${action}`;
                action = { type, params };
            } else {
                let { type } = action;
                if (type) {
                    action.type = `${namespace}/${type}`;
                }
            }
            return this.dispatch(action, ...params);
        };
    }

    /**
     * 订阅
     * @param fn
     * @returns {function()}
     */
    subscribe(fn) {
        if (typeof fn !== 'function') {
            throw new Error('first argument of subscription should be a function');
        }
        this._fn.push(fn);

        /**
         * 取消订阅
         */
        return () => {
            const index = this._fn.indexOf(fn);
            this._fn.splice(index, 1);
        };
    }

    /**
     *
     * @param action
     * @param data
     * @returns {*}
     */
    dispatch(action, ...data) {
        //兼容字符串
        if (typeof action === 'string') {
            action = { type: action, data };
        }
        const { type } = action;
        const [namespace, reduce] = type.split('/');
        if (!namespace || !reduce) {
            throw Error(`action ${type} should like "namespace/reduce"`);
        }
        //
        const model = this._store[namespace];
        if (!model) {
            throw Error(`can't find the model "${namespace}"`);
        }
        //中间件应用
        return this.middle.go(function(action) {
            const { type } = action;
            const [namespace, reduce] = type.split('/');
            const fn = this[reduce];
            if (!fn) {
                throw Error(`can't find function "${reduce}" in model "${namespace}"`);
            }
            return this[reduce].call(this, model.state, action);
        }, {
            model: model,
            action: action
        }).then((ret) => {
            // 触发 subscribe
            const retState = {};
            const [namespace, reduce] = action.type.split('/');
            retState[namespace] = ret;

            this._fn.map((fn) => {
                fn(action, retState);
            });
            return ret;
        });
    };

    /**
     * 加载中间件
     * @param middleware
     */
    use(...middleware) {
        this.middle.use(...middleware);
        return this;
    }
}

export default new Store();