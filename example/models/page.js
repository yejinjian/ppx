const sleep = (time = 0) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve,time);
	});
};

export default class app {
	constructor() {
		this.state = {
			a: 1,
			b: 2
		};
	}

	bootstrap() {
		this.dispatch('add');
	}

	async add(state, action) {
		await sleep(2000);
		return {
			...state,
			a: state.a +1
		}
	}

	minus(state, action) {
		return {
			...state,
			a: state.a - 1
		};
	}
}