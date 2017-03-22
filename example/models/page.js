export default class Model {
  constructor() {
    this.namespace = 'app';
    this.state = {
      a: 1,
      b: 2
    }
  }
  add() {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        const state= this.state;
        resolve ({
          ...state,
          a: state.a+1,
        });
      }, 1000);
    })
  }

  async del(){
    const state= this.state;
    return await {
      ...state,
      a: state.a-1
    }
  }
}