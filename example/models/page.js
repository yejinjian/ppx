export default class app {
  constructor() {
    this.state = {
      a: 1,
      b: 2
    };
  }
  bootstrap(){
    this.dispatch('add');
  }
  sleep (time, model) {
    return new Promise( (resolve, reject) => {
	    const state = model;
      setTimeout(()=> {
        resolve({
          ...state,
          a: state.a+1
        });
      }, time);
    })
  }

  async add(state, action) {
    return await this.sleep(1000, state)
  }

  minus(state, action){
    return {
      ...state,
      a: state.a - 1
    }
  }
}