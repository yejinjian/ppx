import 'promise-polyfill';
import middleware from './applymiddleware';
import Util  from './util';

const _store = {};
const _fn = [];
const middle = new middleware();

//插件用于数据save与返回promise
const plugin = async function(next, action) {
	const ret = await next(action);
	let { state } = this;
	if(ret === undefined){
		return ;
	}
	this.state = Object.assign(state, ret);
	// 修改值
	triggerSubscribe(action, ret);
	return ret;
};
middle.use(plugin);

/**
 * 触发 subscribe
 * @param action
 * @param ret
 */
const triggerSubscribe = (action, ret)=>{
	const retState = {};
	const [namespace, reduce] = action.type.split('/');
	retState[namespace] = ret;
	//触发 subscribe
	_fn.map((fn) => {
		fn(retState);
	});
};

/**
 *
 * @param namespace
 * @returns {function(*=, ...[*])}
 * @private
 */
const _addDispatch = (namespace)=>{
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
		return dispatch(action, ...params);
	}
};


/**
 * 事件派送
 * @param action
 * @param params //当action 是字符串时被使用
 * @returns {Promise.<TResult>|PromiseLike<T>}
 */
const dispatch = (action, ...data) => {
	//兼容字符串
	if (typeof action === 'string') {
		action = { type: action, data };
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
	return middle.go(function(action) {
		const { type } = action;
		const [namespace, reduce] = type.split('/');
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

	// namespace
	let { namespace, constructor } = model;
	if (constructor && constructor.name) {
		namespace = constructor.name;
	}
	if (!namespace) {
		throw new Error(`It is not a model: ${model}`);
	}

	if (!replace && _store[namespace]) {
		console.warn(`Have use this model before: ${model}`);
		return false;
	}
	// save namespace;
	model.namespace = namespace;
	// 不鼓励在model中使用dispatch 但是想来会有复杂需求使用到
	model.dispatch = _addDispatch(namespace);
	// save
	_store[namespace] = model;
	// model 触发事件调用 不鼓励使用
	if (typeof model.bootstrap === 'function') {
		Util.defer(model.bootstrap.bind(model));
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
