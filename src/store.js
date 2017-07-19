import 'promise-polyfill';
import middleware from './applymiddleware';
import { defer } from './util';

const _store = {};
const _fn = [];
const middle = new middleware();

//插件用于数据save与返回promise
const plugin = async function (next, action) {
	const data = await next(action);
	this.model && (this.model.state = data);
	const retState = {};
	retState[this.model.namespace] = data;
	return retState;
};
middle.use(plugin);

/**
 * 事件派送
 * @param action
 * @returns {*}
 */
const dispatch = (action, ...params) => {
	if (typeof action === 'string') {
		action = { type: action, params };
	}
	const [namespace, reduce] = action.type.split('/');
	if (!namespace || !reduce) {
		throw Error(`action ${action.type} should like "namespace/reduce"`);
	}
	//中间件应用
	const model = _store[namespace];
	if (!model) {
		throw Error(`can't find the model "${namespace}"`);
	}
	return middle.go((action) => {
		let s = model[reduce].call(model, action);
		//解决同步返回时的state未修改问题
		if (s && !s.then) {
			model.state = s;
		}
		return s;
	}, {
		model: model,
		action: action
	}).then((data) => {
		//触发 subcribe
		_fn.map((fn) => {
			fn(data);
		});
	});
};

/**
 * model的加载
 * @param model
 * @param replace
 * @returns {boolean}
 */
const model = (model, replace = false) => {

	if (!model) {
		console.warn(`add null model: ${model}`);
		return false;
	}
	if (typeof model === 'function') {
		model = new model();
	}

	const { namespace } = model;
	if (!namespace) {
		console.warn(`It is not a model: ${model}`);
		return false;
	}

	if (!replace && _store[namespace]) {
		console.warn(`Have use this model before: ${model}`);
		return false;
	}
	/**
	 * model 内触发 dispath;
	 * @param action
	 */
	model.dispatch = (action) => {
		if (typeof action === 'string') {
			const type = `${namespace}/${action}`;
			action = { type };
		} else {
			let { type } = action;
			if (type) {
				action.type = `${namespace}/${type}`;
			}
		}
		return dispatch(action);
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
