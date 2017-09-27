export  default  class Middleware {
  constructor() {
    this.middlewares = [];
  }

	/**
   *
	 * @param next
	 * @param data
	 * @returns {*}
	 */
  go(next, data) {
    return next(data);
  }

	/**
   * 中间件封装
	 * @param middlewares
	 * @returns {Middleware}
	 */
  use(...middlewares) {
    middlewares.map((middleware)=> {
      if (typeof middleware !== 'function') {
        return false;
      }
      this.middlewares.push(middleware);
      this.go = ((stack) => (next, data) => stack(()=> {
        return middleware.call(data, next, data);
      }, data))(this.go);
    });
    return this;
  }
}

