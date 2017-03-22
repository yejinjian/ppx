export default class Model {
  constructor() {
    this.namespace = 'app';
    this.state = {
      a: 1,
      b: 2
    }
  }
  sleep (time) {
    const self = this;
    return new Promise( (resolve, reject) => {
      setTimeout(()=> {
        const state = self.state;
        resolve({
          ...state,
          a: state.a+1
        });
      }, time);
    })
  }

  async add() {
    return await this.sleep(1000)
  }

  minus(){
    const state= this.state;
    return {
      ...state,
      a: state.a-1
    }
  }
}