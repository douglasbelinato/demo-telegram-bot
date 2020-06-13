// Lista por sessão. Cada usuário que falar com o Bot terá sua sessão, portanto, sua lista particular
const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const bot = new Telegraf(env.token)

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    ))

bot.use(session())

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    await ctx.reply(`Escreva os itens que deseja adicionar...`)
    ctx.session.lista = []
    await ctx.reply(`Lista criada`)
})

bot.on('text', ctx => {
    const texto = ctx.update.message.text
    ctx.session.lista.push(texto)
    ctx.reply(`${texto} adicionado!`, botoes(ctx.session.lista))
})

bot.action(/delete (.+)/, ctx => {
    const itemCapturado = ctx.match[1]
    ctx.session.lista = ctx.session.lista.filter(item => item !== itemCapturado)
    ctx.reply(`${itemCapturado} deletado!`, botoes(ctx.session.lista))
})

bot.startPolling()