const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    await ctx.reply(`Seja bem vindo, ${ctx.update.message.from.first_name}! 😁`)
    await ctx.replyWithHTML(`Destacando mensagem <b>HTML</b> <i>de</i> <code>várias</code> <pre>formas possíveis</pre>
                            <a href="http://www.google.com.br">Google</a>`)
    await ctx.replyWithMarkdown('Destacando mensagem *Markdown* _de_ `várias formas` ```possíveis```' +
                                '[Google](http://www.google.com)')
    await ctx.replyWithPhoto({source: `${__dirname}/images/dog_cat.jpeg`})
    await ctx.replyWithPhoto('https://i.picsum.photos/id/685/200/200.jpg', {caption: 'Linda foto!'})
    await ctx.replyWithPhoto({url: 'https://i.picsum.photos/id/985/200/200.jpg'})
    await ctx.replyWithLocation(29.9773008, 31.1303068)
    await ctx.replyWithVideo({source: `${__dirname}/video/sample-video.mp4`})
})

bot.startPolling()