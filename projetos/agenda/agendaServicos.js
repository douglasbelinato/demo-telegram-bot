const moment = require('moment')
const axios = require('axios')
const { resize } = require('telegraf/markup')

const baseUrl = 'http://localhost:3001/tarefas'

const getAgenda = async data => {
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`
    console.log('getAgenda - url', url)
    const response = await axios.get(url)
    const pendente = item => item.dt_conclusao === null && moment(item.dt_previsao).isSameOrBefore(data)
    return response.data.filter(pendente)
}

const getTarefa = async id => {
    const url = `${baseUrl}/${id}`
    console.log('getTarefa - url', url)
    const response = await axios.get(url)
    return response.data
}

const getTarefasSemPrevisao = async () => {
    const url = `${baseUrl}?_sort=descricao&_order=asc`
    console.log('getTarefasPendentes - url', url)
    const response = await axios.get(url)
    return response.data.filter(tarefa => tarefa.dt_previsao === null && tarefa.dt_conclusao === null)
}

const getTarefasConcluidas = async () => {
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`
    console.log('getTarefasConcluidas - url', url)
    const response = await axios.get(url)
    return response.data.filter(tarefa => tarefa.dt_conclusao !== null)
}

const incluirTarefa = async desc => {
    const tarefa = { descricao: desc, dt_previsao: null, dt_conclusao: null, observacao: null }
    console.log('incluirTarefa - url', `${baseUrl}`)
    console.log('payload', tarefa)
    const response = await axios.post(`${baseUrl}`, tarefa)
    return response.data
}

const atualizarTarefa = async (id, tarefaAtualizada) => {    
    const url = `${baseUrl}/${id}`
    console.log('atualizarTarefa - url', url)
    console.log('payload', tarefaAtualizada)
    const response = await axios.put(url, tarefaAtualizada)
    return response.data
}

const concluirTarefa = async id => {
    console.log('concluirTarefa')
    const tarefa = await getTarefa(id)
    const tarefaAtualizada = { ...tarefa, dt_conclusao: moment().format('YYYY-MM-DD')}
    return await atualizarTarefa(id, tarefaAtualizada)
}

const excluirTarefa = async id => {
    const url = `${baseUrl}/${id}`
    console.log('excluirTarefa - url', url)
    await axios.delete(url)
}

const atualizarDataTarefa = async (idTarefa, data) => {
    const tarefa = await getTarefa(idTarefa)
    const tarefaAtualizada = { ...tarefa, dt_previsao: data.format('YYYY-MM-DD')}
    return await atualizarTarefa(idTarefa, tarefaAtualizada)
}

const atualizarObsTarefa = async (idTarefa, obs) => {
    console.log('atualizarDataTarefa')
    const tarefa = await getTarefa(idTarefa)
    const tarefaAtualizada = { ...tarefa, observacao: obs}
    return await atualizarTarefa(idTarefa, tarefaAtualizada)
}

module.exports = {
    getAgenda,
    getTarefa,
    getTarefasSemPrevisao,
    getTarefasConcluidas,    
    incluirTarefa,
    atualizarTarefa,
    concluirTarefa,
    excluirTarefa,
    atualizarDataTarefa,
    atualizarObsTarefa
}