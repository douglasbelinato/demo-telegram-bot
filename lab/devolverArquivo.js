const env = require('../.env')
const Telegraf = require('telegraf')
const axios = require('axios')
const bot = new Telegraf(env.token)

bot.on('voice', async ctx => {
    const id = ctx.update.message.voice.file_id
    // o mesmo path_file fica disponível por 1 hora. Depois disso, é preciso realizar 
    // uma requisição get para obter o novo path gerado
    const response = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`)
    ctx.replyWithVoice({ url: `${env.apiFileUrl}/${response.data.result.file_path}`})
})

bot.on('photo', async ctx => {
    const id = ctx.update.message.photo[0].file_id
    const response = await axios.get(`${env.apiUrl}/getFile?file_id=${id}`)
    console.log('response', response)
    ctx.replyWithPhoto({ url: `${env.apiFileUrl}/${response.data.result.file_path}`})
})

bot.startPolling()