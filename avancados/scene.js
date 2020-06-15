const env = require('../.env')
const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Scene = require('telegraf/scenes/base')
const Stage = require('telegraf/stage')
const { enter, leave } = Stage
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    await ctx.reply(`Entre com /echo ou /soma para iniciar`)
})

// Scene Echo -----------------------
const echoScene = new Scene('echo')
echoScene.enter(ctx => ctx.reply('Entrando em Echo Scene'))
echoScene.leave(ctx => ctx.reply('Saindo em Echo Scene'))
echoScene.command(leave())
echoScene.on('text', ctx => ctx.reply(ctx.message.text))
echoScene.on('message', ctx => ctx.reply('Apenas mensagens de texto'))

// Scene Sum -----------------------
let sum = 0

const sumScene = new Scene('sum')
sumScene.enter(ctx => ctx.reply('Entrando em Sum Scene'))
sumScene.leave(ctx => ctx.reply('Saindo em Sum Scene'))

sumScene.use(async (ctx, next) => {
    await ctx.reply('Você está em Sum Scene, escreva números para somar')
    await ctx.reply('Você pode também /zerar ou /sair')
    next()
})

sumScene.command('zerar', ctx => {
    sum = 0
    ctx.reply(`Valor: ${sum}`)
})

sumScene.command('sair', leave())

sumScene.hears(/(\d+)/, ctx => {
    sum += parseInt(ctx.match[1])
    ctx.reply(`Valor: ${sum}`)
})

sumScene.on('message', ctx => ctx.reply('Apenas números'))

// Stage -----------------------
const stage = new Stage([echoScene, sumScene])
bot.use(session())
bot.use(stage.middleware()) // é o que permite a navegação nos middlewares definidos acima
bot.command('soma', enter('sum'))
bot.command('soma', enter('sum'))
bot.command('echo', enter('echo'))
bot.on('message', ctx => ctx.reply('Entre com /echo ou /soma'))

bot.startPolling()