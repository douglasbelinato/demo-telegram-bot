const env = require('../.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!\nEm casode dúvidas, peça /ajuda`)    
})

bot.command('ajuda', ctx => ctx.reply('/ajuda: vou mostrar as opções:'
            + '\n/ajudaHears: para testar via hears'
            + '\n/opcao2: Opçõa genérica 2'
            + '\n/opcao3: Opção genérica 3'
))

bot.hears('/ajudaHears', ctx => ctx.reply('Comando /ajudaHears capturado por hears'
                                            + ', mas prefira /ajuda mesmo'))

bot.hears(/\/opcao(2|3)/i, ctx => ctx.reply('Resposta para opções genéricas'))

bot.startPolling()