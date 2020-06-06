const env = require('../.env')
const Telegraf = require('telegraf')
const bot = new Telegraf(env.token)

bot.start(ctx => {
    const name = ctx.update.message.from.first_name
    ctx.reply(`Seja bem vindo ${name}!`)
})

bot.on('text', ctx => 
    ctx.reply(`Texto '${ctx.update.message.text}' recebido com sucesso!`))

bot.on('location', ctx => {
    const location = ctx.update.message.location
    console.log('location', location)
    ctx.reply(`Entendido, você está em 
        Lat: ${location.latitude}
        Lon:  ${location.longitude}`)
})

bot.on('contact', ctx => {
    const contact = ctx.update.message.contact
    console.log('contact', contact)
    ctx.reply(`Contato recebido: Nome: ${contact.first_name} - Tel: ${contact.phone_number}`)
})

bot.on('voice', ctx => {
    const voice = ctx.update.message.voice
    console.log('voice', voice)
    ctx.reply(`Áudio recebido. Ele possui ${voice.duration} segundos`)
})

bot.on('photo', ctx => {
    const photos = ctx.update.message.photo
    console.log('photos', photos)
    photos.forEach((photo, index) => {
        ctx.reply(`Foto ${index} tem resolução de ${photo.width}x${photo.height}`)
    })
})

bot.on('sticker', ctx => {
    const sticker = ctx.update.message.sticker
    console.log('sticker', sticker)
    ctx.reply(`Estou vendo que você enviou o ${sticker.emoji} do conjunto ${sticker.set_name}`)
})

bot.startPolling()