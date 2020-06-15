const env = require('../.env')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const schedule = require('node-schedule')

const telegram = new Telegram(env.token)
const bot = new Telegraf(env.token)

let contador = 1
const chatId = env.authorized_client_ids[0]

const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Cancelar', 'cancelar')
]))

const notificar = () => {
    telegram.sendMessage(chatId, `Essa é uma msg do evento [${contador++}]`, botoes)
}

const notificacao = new schedule.scheduleJob('*/5 * * * * *', notificar)

bot.action('cancelar', ctx => {
    notificacao.cancel()
    ctx.reply('OK! Parei de enviar msgs...')
})

bot.startPolling()