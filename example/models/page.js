const sleep = (time = 0) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve,time);
	});
};

export default class App {
	constructor() {
		this.state = {
			a: 1,
			b: 2
		};
	}

	bootstrap() {
		//当model初始化后触发
		this.dispatch('add');
	}

	add(state, action) {
        return sleep(1000).then(()=>{
        	return {
                ...state,
                a: state.a +1
            }
		});
	}

	minus(state, action) {
        return sleep(100).then(()=>{
            return {
                ...state,
                a: state.a -1
            }
        });
	}
}