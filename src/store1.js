import 'promise-polyfill';
import middleware from './applymiddleware';
import Util  from './util';

//const _store = {};
//const _fn = [];
//const middle = new middleware();

//插件用于数据save与返回promise
const plugin = async function(next, action) {
	const ret = await next(action);
	let { state } = this;
	// 修改值
	this.state = Object.assign(state, ret);
	return ret;
};
//middle.use(plugin);

class Store {
	constructor() {
		this._store = {};
		this._middle = new middleware();
		this._fn = []; //subscribe
		this.use(plugin);
	}

	/**
	 * model的加载
	 * @param Model
	 * @param replace
	 * @returns {boolean}
	 */
	model(Model, replace = false) {
		if (!Model) {
			throw new Error('should add a model not null');
		}
		// model
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

		if (!replace && this._store[namespace]) {
			console.warn(`Have use this model before: ${model}`);
			return false;
		}
		// save namespace;
		model.namespace = namespace;
		// model 内触发 dispath
		model.dispatch = this._addDispatch(model);
		// 保存到store
		this._store[namespace] = model;
		// model 触发事件调用
		if (typeof model.bootstrap === 'function') {
			Util.defer(model.bootstrap.bind(model));
		}
	}

	/**
	 * 给model添加 dispatch 方法
	 * @param action
	 * @param data
	 * @private
	 */
	_addDispatch(model) {
		return (action, ...data)=>{
			const { namespace } = model;
			if (typeof action === 'string') {
				action = `${namespace}/${action}`;
			} else {
				const { type } = action;
				if (type) {
					action.type = `${namespace}/${type}`;
				}
			}
			this.dispatch(action, ...data);
		}
	}
	/**
	 * 时间派分
	 * @param action
	 * @param data 当action是string时 才会取data
	 * @returns {*}
	 */
	dispatch(action, ...data) {
		// 兼容字符串
		if (typeof action === 'string') {
			action = { type: action, data };
		}

		const { type } = action;
		const [namespace, reduce] = type.split('/');
		if (!namespace || !reduce) {
			throw new Error(`action ${type} should like "model/reduce"`);
		}
		//
		const model = this._store[namespace];
		if (!model) {
			throw Error(`can't find the model "${namespace}"`);
		}

		// 中间件应用
		return this._middle.go(function(action) {
			const { type } = action;
			const [namespace, reduce] = type.split('/');
			return this[reduce].call(this, model.state, action);
		}, {
			model: model,
			action: action
		}).then((data)=>{
			console.log(data);
			this._triggerSubscribe();
		});
	}

	/**
	 *
	 * @private
	 */
	_triggerSubscribe(){

		const retState = {};
		const [namespace, reduce] = action.type.split('/');
		retState[namespace] = ret;
		//触发 subcribe
		this._fn.map((fn) => {
			fn(retState);
		});
	}

	/**
	 * 监听dispatch
	 * @param fn
	 */
	subscribe(fn) {
		if (typeof fn !== 'function') {
			throw new Error('first argument of subscribe should be a function');
		}
		this._fn.push(fn);
	}

	/**
	 * 插件加载
	 * @param middlewares
	 */
	use(...middlewares) {
		this._middle.use(...middlewares);
	}
}

export default  new Store();