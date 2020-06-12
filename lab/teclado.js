const env = require('../.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

const tecladoEsportes = Markup.keyboard([
    ['⚽ Futebol','🏀 Basquete','🏈 Futebol americano'],
    ['⚾ Baisebol','🎾 Tênis','🏐 Vôlei'],
    ['🎱 Sinuca','🏓 Pingue pongue','🏹 Arco e flecha'],
    ['Não gosto de esportes'],
]).resize().extra()
// resize() faz com que o teclado se redimensione de acordo com o tamanho da tela
// extra() renderiza de fato o teclado na tela

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
    await ctx.reply(`Qual sua cor preferida?`,
                    Markup.keyboard(['Azul','Verde']).resize().oneTime().extra()) // ontime() mostra apenas 1 vez o teclado
})

bot.hears(['Azul', 'Verde'], async ctx => {
    await ctx.reply(`Nossa, eu também gosto da cor ${ctx.match}!`)
    await ctx.reply('E quais esportes você mais gosta?', tecladoEsportes)
})

bot.hears(['⚽ Futebol','🏐 Vôlei','🏀 Basquete'], ctx => ctx.reply(`Eu gosto de ${ctx.match} também!`))

bot.hears(['Não gosto de esportes'], ctx => ctx.reply(`Sem problemas. Mas eu acho esportes legais 😁`))

bot.on('text', ctx => ctx.reply(`Humm... eu não entendo muito bem as regras de ${ctx.update.message.text}`))

bot.startPolling()