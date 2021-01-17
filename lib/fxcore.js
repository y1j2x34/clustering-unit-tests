export function api1() {
    return 'hello'
}
export function execute(callback, context = null, ...args){
    return callback.call(context, ...args);
}