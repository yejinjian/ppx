/**
 * dispatch 并发处理
 * @type {{}}
 */
const actions = {};

// todo 应该以action的hash为key 即同action.type 但是参数不同算不同
export default function(globalOnly = false) {
	return function (next, action) {
		const { type } = action;
		if (globalOnly || action.only) {
			if (actions[type]) {
				console.warn(' %o is on trigger', action);
				return ;
			}
		}
		return actions[type] = Promise.resolve().then(()=>{
			return next(action);
		}).then((ret)=>{
			delete actions[type];
			return ret;
		})
	};
}