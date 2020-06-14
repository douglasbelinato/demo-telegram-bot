const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const axios = require('axios')
const bot = new Telegraf(env.token)

const tecladoOpcoes = Markup.keyboard([
    ['O que são bots?', 'O que verei no curso?'],
    ['Posso mesmo automatizar tarefas?'],
    ['Como comprar o curso?']
]).resize().extra()

const botoes = Extra.markup(Markup.inlineKeyboard([
    Markup.callbackButton('Sim', 's'),
    Markup.callbackButton('Não', 'n')
], { columns: 2}))

const localizacao = Markup.keyboard([
    Markup.locationRequestButton('Clique aqui para enviar sua localização')
]).resize().oneTime().extra()

bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.replyWithMarkdown(`*Olá ${name}*\nEu sou o ChatBot do curso`)
    await ctx.replyWithMarkdown('_Posso te ajudar em algo?_', tecladoOpcoes)
})

bot.hears('O que são bots?', ctx => {
    ctx.replyWithMarkdown('*Bot*, diminutivo de _robot_, também conhecido como Internet bot ou web robot,' +
                          'é uma aplicação de software concebido para simular ações humanas repetidas ' +
                          'vezes de maneira padrão, da mesma forma como faria um robô. (Fonte: Wikipedia)', tecladoOpcoes)
})

bot.hears('O que verei no curso?', async ctx => {
    await ctx.replyWithMarkdown('_Nós_ construiremos *3 bots*!')
    await ctx.reply('1. Bot lista de compras')
    await ctx.reply('2. Bot lista de eventos')
    await ctx.reply('3. Um que será a minha cópia =)', tecladoOpcoes)
})


bot.hears('Posso mesmo automatizar tarefas?', ctx => {
    ctx.replyWithMarkdown('Claro! Quer uma amostra?', botoes)
})

bot.hears('Como comprar o curso?', ctx => {
    ctx.replyWithMarkdown('Basta accesar este [link](https://www.cod3r.com.br)')
})

bot.action('n', ctx => ctx.reply('Tudo bem', tecladoOpcoes))

bot.action('s', async ctx => {
    await ctx.reply('Legal! Me mande sua localização ou escreva um texto qualquer', localizacao)
})

bot.hears(/texto qualquer/i, async ctx => {
    await ctx.reply('Essa piada é velha hein! Tente outra =)', tecladoOpcoes)
})

bot.on('text', async ctx => {
    let msg = ctx.message.text
    msg = msg.split(' ').reverse().join('')
    await ctx.reply(`a sua mensagem ao contrário é: ${msg}`)
    await ctx.reply('Isso mostra que eu consigo ler e processar sua mensagem', tecladoOpcoes)
})

bot.on('location', async ctx => {    
    try {
        
        const url = 'http://api.openweathermap.org/data/2.5/weather'
        const appId = '' // Necessário cadastro no site do api openweathermap para gerar appid
        const { latitude: lat, longitude: lon } = ctx.message.location
        const params = `?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`
        
        const response = await axios.get(url + params)

        await ctx.reply(`Você está em ${response.data.name}`)
        await ctx.reply(`A temperatura é de ${response.data.main.temp}ºC`, tecladoOpcoes)
    } catch (e) {
        console.error(e)
        ctx.reply('Desculpe, não consegui consultar a temperatura do local onde você está', tecladoOpcoes)       
    }
})

bot.startPolling()