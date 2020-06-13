// Lista compartilhada entre todos que falarem com o Bot
const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

let lista = []

const botoes = () => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    ))

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    await ctx.reply(`Escreva os itens que deseja adicionar...`)
})

bot.on('text', ctx => {
    const texto = ctx.update.message.text
    lista.push(texto)
    ctx.reply(`${texto} adicionado!`, botoes())
})

bot.action(/delete (.+)/, ctx => {
    const itemCapturado = ctx.match[1]
    lista = lista.filter(item => item !== itemCapturado)
    ctx.reply(`${itemCapturado} deletado!`, botoes())
})

bot.startPolling()