import 'promise-polyfill';
import middleware from './applymiddleware';
import { defer } from './util';

const _store = {};
const _fn = [];
const middle = new middleware();

//插件用于数据save与返回promise
const plugin = async function (next, action) {
	const ret = await next(action);
	let {state} = this;
	// 修改值
	this.state = Object.assign(state, ret);
	const retState = {};
	const [namespace, reduce] = action.type.split('/');
	retState[namespace] = ret;
	//触发 subcribe
	_fn.map((fn) => {
		fn(retState);
	});
	return ret;
};
middle.use(plugin);

/**
 * 事件派送
 * @param action
 * @param params
 * @returns {Promise.<TResult>|PromiseLike<T>}
 */
const dispatch = (action, ...params) => {
	//兼容字符串
	if (typeof action === 'string') {
		action = { type: action, params };
	}
	const { type } = action;
	const [namespace, reduce] = type.split('/');
	if (!namespace || !reduce) {
		throw Error(`action ${type} should like "namespace/reduce"`);
	}
	//中间件应用
	const model = _store[namespace];
	if (!model) {
		throw Error(`can't find the model "${namespace}"`);
	}
	return middle.go(function (action) {
		const { type } = action;
		const [namespace, reduce] = type.split('/');
		console.log(this);
		return this[reduce].call(this, model.state, action);
	}, {
		model: model,
		action: action
	});
};

/**
 * model的加载
 * @param model
 * @param replace
 * @returns {boolean}
 */
const model = (Model, replace = false) => {
	if (!Model) {
		console.warn(`add null model: ${Model}`);
		return false;
	}
	let model = Model;
	if (typeof Model === 'function') {
		model = new Model();
	}
	const { constructor } = model;
	if (!constructor || !constructor.name) {
		console.warn(`It is not a model: ${model}`);
		return false;
	}
	const namespace = constructor.name;
	if (!replace && _store[namespace]) {
		console.warn(`Have use this model before: ${model}`);
		return false;
	}
	/**
	 * model 内触发 dispath
	 * @param action
	 * @param params
	 * @returns {Promise.<TResult>|PromiseLike.<T>}
	 */
	model.dispatch = (action,...params) => {
		if (typeof action === 'string') {
			const type = `${namespace}/${action}`;
			action = { type, params };
		} else {
			let { type } = action;
			if (type) {
				action.type = `${namespace}/${type}`;
			}
		}
		return dispatch(action, ...params);
	};
	// save
	_store[namespace] = model;
	// model 触发事件调用
	if (typeof model.bootstrap === 'function') {
		defer(model.bootstrap.bind(model));
	}
};

/**
 * 监听dispatch
 * @param fn
 */
const subscribe = (fn) => {
	if (typeof fn !== 'function') {
		throw new Error('first argument of subcribe should be a function');
	}
	_fn.push(fn);
};
/**
 * 插件加载
 * @param middlewares
 */
const use = (...middlewares) => {
	middle.use(...middlewares);
};

export default {
	middle,
	_store,
	model,
	dispatch,
	subscribe,
	use
};
