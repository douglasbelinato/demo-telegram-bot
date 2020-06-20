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

const getTarefasPendentes = async () => {
    const url = `${baseUrl}?_sort=descricao&_order=asc`
    console.log('getTarefasPendentes - url', url)
    const response = await axios.get(url)
    return response.data.filter(tarefa => tarefa.dt_previsao === null && tarefa.dt_conclusao === null)
}

const getTarefasConcluidas = async () => {
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`
    console.log('getTarefasPendentes - url', url)
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

const concluirTarefa = async id => {
    const tarefa = await getTarefa(id)
    const tarefaAtualizada = { ...tarefa, dt_conclusao: moment().format('YYYY-MM-DD')}
    const url = `${baseUrl}/${id}`
    console.log('concluirTarefa - url', url)
    console.log('payload', tarefaAtualizada)
    const response = await axios.put(url, tarefaAtualizada)
    return response.data
}

const excluirTarefa = async id => {
    const url = `${baseUrl}/${id}`
    console.log('excluirTarefa - url', url)
    await axios.delete(url)
}

module.exports = {
    getAgenda,
    getTarefa,
    getTarefasPendentes,
    getTarefasConcluidas,    
    incluirTarefa,
    concluirTarefa,
    excluirTarefa
}