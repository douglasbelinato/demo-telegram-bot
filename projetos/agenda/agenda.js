const env = require('../../.env')
const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const moment = require('moment')
const agendaServicos = require('./agendaServicos')

const bot = new Telegraf(env.token)

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
    return Extra.markup(Markup.inlineKeyboard(botoes, { columns: 1}))
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

bot.command('tarefasPendentes', async ctx => {
    const tarefas = await agendaServicos.getTarefasPendentes()
    if (tarefas && tarefas.length > 0) {
        ctx.reply('Estas são as tarefas pendentes', botoesAgenda(tarefas))
    } else {
        ctx.reply('Você não tem tarefas pendentes', botoesAgenda(tarefas))
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