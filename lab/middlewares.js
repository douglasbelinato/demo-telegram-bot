// Middleware Pattern ou Chain of Responsability Pattern

const execution = (context, ...middlewares) => {
    const run = index => {
        middlewares && index < middlewares.length && middlewares[index](context, () => run(index + 1))
    }
    run(0)    
}

const middleware1 = (context, next) => {
    context.info1 = 'middleware1'
    next()
}

const middleware2 = (context, next) => {
    context.info2 = 'middleware2'
    next()
}

const middleware3 = (context, next) =>  context.info3 = 'middleware3'


const context = {}
execution(context, middleware1, middleware2, middleware3)
console.log('context', context)