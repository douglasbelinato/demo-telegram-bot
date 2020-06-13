const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const session = require('telegraf/session')
const bot = new Telegraf(env.token)

let dados = {}

const botoes = lista => Extra.markup(
    Markup.inlineKeyboard(
        lista.map(item => Markup.callbackButton(item, `delete ${item}`)),
        { columns: 3 }
    ))


bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    await ctx.reply(`Escreva os itens que deseja adicionar...`)    
})

bot.use((ctx, next) => {
    const chatId = ctx.chat.id
    // dados[chatId] = [] equivale à dados.chatId = []
    if(!dados.hasOwnProperty(chatId)) dados[chatId] = []
    ctx.itens = dados[chatId]
    next()
})

bot.on('text', ctx => {
    let texto = ctx.update.message.text
    if (texto.startsWith('/')) texto = texto.substring(1)
    ctx.itens.push(texto)
    ctx.reply(`${texto} adicionado!`, botoes(ctx.itens))
})

bot.action(/delete (.+)/, ctx => {
    const indice = ctx.itens.indexOf(ctx.match[1])    
    // splice - 1o param a partir de qual indice vc quer começar e o 2o param qts elementos vc quer remover
    if (indice >= 0) ctx.itens.splice(indice, 1)
    ctx.reply(`${ctx.match[1]} deletado!`, botoes(ctx.itens))
})

bot.startPolling()