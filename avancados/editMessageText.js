const env = require('../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

let level = 5

const getLevel = () => {
    let label = ''
    for (let i = 1; i <= 9; i++) {
        label += (level === i) ? '||' : '='
    }
    return label
}

const botoes = () => Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('<<', '<'),
    Markup.callbackButton(getLevel(), 'result'),
    Markup.callbackButton('>>', '>')
], { columns: 3 }))

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo ${name}!`)
    ctx.reply(`Nivel: ${level}`, botoes())
})

bot.action('<', ctx => {
    if (level === 1) {
        ctx.answerCbQuery('Chegou no limite')
    } else {
        level--
        ctx.editMessageText(`Nivel: ${level}`, botoes())
    }
})

bot.action('>', ctx => {
    if (level === 9) {
        ctx.answerCbQuery('Chegou no limite')
    } else {
        level++
        ctx.editMessageText(`Nivel: ${level}`, botoes())
    }
})

bot.action('result', ctx => {
    ctx.editMessageText(`O nivel atual está em: ${level}`)
})

bot.startPolling()