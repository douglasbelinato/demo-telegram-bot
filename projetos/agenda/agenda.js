const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')
const agendaServicos = require('./agendaServicos')

const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')

const bot = new Telegraf(env.token)


// Inicializa o Bot ----------------------
bot.start(async ctx => {
    const name = ctx.update.message.from.first_name
    await ctx.reply(`Seja bem vindo ${name}!`)
})

const formataData = data => data ? moment(data).format('DD/MM/YYYY') : ''

const exibirTarefa = async (ctx, tarefaId, novaMsg = false) => {
    const tarefa = await agendaServicos.getTarefa(tarefaId)
    const conclusao = tarefa.dt_conclusao ? `\n<b>Concluída em:</b> ${formataData(tarefa.dt_conclusao)}` : ''
    const msg = `
<b>${tarefa.descricao}</b>
<b>Previsão: </b>${formataData(tarefa.dt_previsao)}${conclusao}
<b>Observações:</b>\n${tarefa.observacao || ''}
    `

    if (novaMsg) {
        ctx.reply(msg, botoesTarefa(tarefaId))
    } else {
        ctx.editMessageText(msg, botoesTarefa(tarefaId))
    }
}

const botoesAgenda = tarefas => {
    const botoes = tarefas.map(item => {
        const data = item.dt_previsao ? `${moment(item.dt_previsao).format('DD/MM/YYYY')} - ` : ''
        return [Markup.callbackButton(`${data}${item.descricao}`, `mostrar ${item.id}`)]
    })
    return Extra.markup(Markup.inlineKeyboard(botoes, { columns: 1 }))
}

const botoesTarefa = idTarefa => Extra.HTML().markup(Markup.inlineKeyboard([
    Markup.callbackButton('✅', `concluir ${idTarefa}`),
    Markup.callbackButton('📅', `setData ${idTarefa}`),
    Markup.callbackButton('📝', `addNota ${idTarefa}`),
    Markup.callbackButton('❌', `excluir ${idTarefa}`)
]))

// Comandos ------------------------------
bot.command('dia', async ctx => {
    const tarefas = await agendaServicos.getAgenda(moment())
    ctx.reply('Aqui está sua agenda do dia', botoesAgenda(tarefas))
})

bot.command('amanha', async ctx => {
    const tarefas = await agendaServicos.getAgenda(moment().add({ day: 1 }))
    ctx.reply('Aqui está sua agenda até amanhã', botoesAgenda(tarefas))
})

bot.command('semana', async ctx => {
    const tarefas = await agendaServicos.getAgenda(moment().add({ week: 1 }))
    ctx.reply('Aqui está sua agenda da semana', botoesAgenda(tarefas))
})

bot.command('concluidas', async ctx => {
    const tarefas = await agendaServicos.getTarefasConcluidas()
    if (tarefas && tarefas.length > 0) {
        ctx.reply('Estas são as tarefas que você já concluiu', botoesAgenda(tarefas))
    } else {
        ctx.reply('Você não tem tarefas concluídas ainda', botoesAgenda(tarefas))
    }
})

bot.command('tarefassemprevisao', async ctx => {
    const tarefas = await agendaServicos.getTarefasSemPrevisao()
    if (tarefas && tarefas.length > 0) {
        ctx.reply('Estas são as tarefas sem previsão', botoesAgenda(tarefas))
    } else {
        ctx.reply('Você não tem tarefas sem previsão', botoesAgenda(tarefas))
    }

})

// Ações ------------------------------
bot.action(/mostrar (.+)/, async ctx => {
    await exibirTarefa(ctx, ctx.match[1])
})

bot.action(/concluir (.+)/, async ctx => {
    await agendaServicos.concluirTarefa(ctx.match[1])
    await exibirTarefa(ctx, ctx.match[1])
    await ctx.reply('Tarefa concluída')
})

bot.action(/excluir (.+)/, async ctx => {
    await agendaServicos.excluirTarefa(ctx.match[1])
    await ctx.editMessageText('Tarefa excluída')
})

const tecladoDatas = Markup.keyboard([
    ['Hoje', 'Amanhã'],
    ['1 Semana', '1 Mês']
]).resize().oneTime().extra()

let idTarefa = null

// dataScene ---------------------------
const dataScene = new Scene('data')

dataScene.enter(ctx => {
    idTarefa = ctx.match[1]
    console.log('idTarefa',idTarefa)
    ctx.reply('Você gostaria de definir alguma data?', tecladoDatas)
})

dataScene.leave(ctx => idTarefa = null)

dataScene.hears(/hoje/gi, async ctx => {
    const data = moment()
    handleData(ctx, data)
})

dataScene.hears(/(Amanh[aã])/gi, async ctx => {
    const data = moment().add({ days: 1 })
    handleData(ctx, data)
})

dataScene.hears(/^(\d+) dias?$/gi, async ctx => {
    const data = moment().add({ days: ctx.match[1] })
    handleData(ctx, data)
})

dataScene.hears(/^(\d+) semanas?/gi, async ctx => {
    const data = moment().add({ weeks: ctx.match[1] })
    handleData(ctx, data)
})

dataScene.hears(/^(\d+) m[eê]s(es)?/gi, async ctx => {
    const data = moment().add({ months: ctx.match[1] })
    handleData(ctx, data)
})

dataScene.hears(/(\d{2}\/\d{2}\/\d{4})/g, async ctx => {
    const data = moment(ctx.match[1], 'DD/MM/YYYY')
    handleData(ctx, data)
})

const handleData = async (ctx, data) => {
    await agendaServicos.atualizarDataTarefa(idTarefa, data)
    await ctx.reply('Data atualizada')
    await exibirTarefa(ctx, idTarefa, true)
    ctx.scene.leave()
}

dataScene.on('message', ctx =>
    ctx.reply('Padrões aceitos: \nDD/MM/YYYY\nX dias \nX semanas \nX meses'))

// observacaoScene ---------------------------
const obsScene = new Scene('observacoes')

obsScene.enter(ctx => {
    idTarefa = ctx.match[1]
    ctx.reply('Adicione suas observações para esta tarefa')
})

obsScene.leave(ctx => idTarefa = null)

obsScene.on('text', async ctx => {
    const tarefa = await agendaServicos.getTarefa(idTarefa)
    const novaObs = ctx.update.message.text
    const obs = tarefa.observacao ? tarefa.observacao + '\n---------\n' + novaObs : novaObs
    const response = await agendaServicos.atualizarObsTarefa(idTarefa, obs)
    await ctx.reply('Observação atualizada')
    await exibirTarefa(ctx, idTarefa, true)
    ctx.scene.leave()
})

obsScene.on('message', ctx => ctx.reply('Apenas observações em texto são aceitas'))

const stage = new Stage([dataScene, obsScene])
bot.use(session()) // embora meu bot não use agenda, o stage e as scenes precisam para funcionar corretamente
bot.use(stage.middleware())

bot.action(/setData (.+)/, Stage.enter('data'))
bot.action(/addNota (.+)/, Stage.enter('observacoes'))

// Incluir uma nova tarefa ---------------
bot.on('text', async ctx => {
    try {
        const tarefa = await agendaServicos.incluirTarefa(ctx.update.message.text)
        await exibirTarefa(ctx, tarefa.id, true)
    } catch (e) {
        console.error(e)
    }
})

bot.startPolling()