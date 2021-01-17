const path = require('path');

const koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const yargs = require('yargs');

yargs.option('port', {
    type: 'number',
    default: 9888
})

const port = yargs.argv.port;

const router = new Router({
    prefix: '/action/'
})

const files = fs.readdirSync(
    path.resolve(__dirname, './actions')
);

const actions = [];

files
    .filter(it => !!it.match(/\.js$/))
    .forEach(filename => {
        const actionModule = require('./actions/' + filename);
        const url = actionModule.url || path.basename(filename, '.js')
        const method = actionModule.method || 'all';
        const handler = typeof actionModule.handler === 'function' ? actionModule.handler : actionModule;
        actions.push({
            url: '/action/'+url,
            method,
            desc: actionModule.description || undefined
        })
        router[method](url, async (ctx) => {
            try{
                const response = await handler(ctx, ctx.params, ctx.query);
                ctx.body = JSON.stringify({
                    success: true,
                    data: response
                });
            } catch(e) {
                ctx.body = JSON.stringify({
                    success: false,
                    error: e.message
                });
            }
        })
    });

const app = new koa();

app.use(router.routes())


const root = new Router();

root.get('/is-running', (ctx) => {
    ctx.body = JSON.stringify(true)
})

root.get('/', (ctx) => {
    
    ctx.body = JSON.stringify({
        success: true,
        urls: [].concat(actions).concat({
            url: '/is-running',
            method: 'GET',
            description: '判断是否运行'
        })
    })
})

app.use(root.routes());


app.listen(port)

console.log('Cluster server started at: ' + port)