const env = require('../.env')
const Telegram = require('telegraf/telegram')
const Markup = require('telegraf/markup')
const axios = require('axios')

const chatId = env.authorized_client_ids[0]

const enviarMensagem = msg => {    
    axios.get(`${env.apiUrl}/sendMessage?chat_id=${chatId}&text=${encodeURI(msg)}`)
        .catch(e => console.log(e))
}

enviarMensagem('Enviando msg assíncrona')

const teclado = Markup.keyboard([
    ['OK', 'Cancelar']
]).resize().oneTime().extra()

const telegram = new Telegram(env.token)
telegram.sendMessage(chatId, 'Essa é uma msg com teclado', teclado)