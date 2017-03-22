export  default  class Middleware {
  constructor() {
    this.middlewares = [];
  }

  go(next, data) {
    const {action} = data;
    return next(action);
  }

  use(...middlewares) {
    middlewares.map((middleware)=> {
      if (typeof middleware !== 'function') {
        return false;
      }
      this.middlewares.push(middleware);
      this.go = ((stack) => (next, data) => stack(()=> {
        return middleware.call(data, next, data.action);
      }, data))(this.go);
    });
    return this;
  }
}

