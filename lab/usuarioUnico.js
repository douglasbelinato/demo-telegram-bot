const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(ctx => {    
    const { id } = ctx.update.message.from
    
    if (env.authorized_client_ids.indexOf(id) !== -1) {
        ctx.reply('Ao seu dispor, mestre!')
    } else {
        ctx.reply('Sinto muito, mas eu só falo com o meu mestre!')
    }
})

bot.startPolling()