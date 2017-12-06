/**
 * Created by tianwu on 2017/9/28.
 */
let prevTime;
const colors = [
    'lightseagreen',
    'forestgreen',
    'goldenrod',
    'dodgerblue',
    'darkorchid',
    'OrangeRed',
    'crimson'
];

const selectColor = (name) => {
    let num = 0;
    for (let i in name) {
        num += name.charCodeAt(i) * i;
    }
    num = num % (colors.length);
    return colors[num];
};
const humanize =() =>{
    let curr = +new Date();
    let ms = curr - (prevTime || curr);
    prevTime = curr;
    return `+${ms}ms`;
};


const formatArgs = (name, color, args) => {
    args[0] = `%c${name} %c${args[0]}%c ${humanize()}`;
    const c = 'color: ' + color;
    args.splice(1, 0, c, 'color: inherit');

    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if ('%%' === match) return;
        index++;
        if ('%c' === match) {
            // we only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
    return args;
};

class debug {
    constructor(name){
        this.name = name;
        this.colors = selectColor(name);
    }
    toggleLog(type,...args){
        args = formatArgs(this.name, this.colors, args);

        return typeof console === 'object'
            && console[type]
            && console[type](...args);
    }
    group(){
        this.toggleLog('group', ...arguments);
        return this;
    }
    groupEnd(){
        this.toggleLog('groupEnd', ...arguments);
        return this;
    }
    log(){
        this.toggleLog('log', ...arguments);
        return this;
    }
    error(){
        this.toggleLog('error', ...arguments);
        return this;
    }
    warn(){
        this.toggleLog('warn', ...arguments);
        return this;
    }
}

export default async function(next, action) {
    const { type } = action;
    const oldState = Object.assign({}, this.state);
    const Debug = new debug(type);
    Debug.group('');
    Debug.log(`pre State: %o`, oldState);
    const data = await next(action);
    Debug.log(`new State: %o`, Object.assign({}, data));
    Debug.groupEnd('');
    return data;
}