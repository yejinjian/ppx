import middleware from './applymiddleware';
import "promise-polyfill";

const _store = {};
const middle = new middleware();

//插件
const plugin = async function (next, state, action) {
  const data = await next(state, action);
  this.model && (this.model.state = data);
  const retState = {};
  retState[this.model.namespace] = data;
  return retState;
};
middle.use(plugin);

export default {
  middle,
  _store,
  /**
   * model的加载
   * @param model
   * @param replace
   * @returns {boolean}
   */
  model: (model, replace = false)=> {
    if (!model) {
      console.warn(`add null model: ${model}`);
      return false;
    }
    if (typeof model === 'function') {
      model = new model();
    }
    const {namespace} = model;
    if (!namespace) {
      console.warn(`It is not a model: ${model}`);
      return false;
    }
    if (!replace && _store[namespace]) {
      console.warn(`Have use this model before: ${model}`);
      return false;
    }
    _store[namespace] = model;
  },
  /**
   * 插件加载
   * @param middlewares
   */
  use: (...middlewares)=> {
    middle.use(...middlewares);
  },
  /**
   * 事件派送
   * @param action
   * @returns {*}
   */
  dispatch(action){
    if (typeof action === 'string') {
      action = {type: action};
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
    return middle.go(model[reduce].bind(model), {
      model: model,
      state: model.state,
      action: action,
    });
  }
}
