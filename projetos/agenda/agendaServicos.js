const moment = require('moment')
const axios = require('axios')

const baseUrl = 'http://localhost:3001/tarefas'

const getAgenda = async data => {
    const url = `${baseUrl}?_sort=dt_previsao,descricao&_order=asc`
    const response = await axios.get(url)
    const pendente = item => item.dt_conclusao === null && moment(item.dt_previsao).isSameOrBefore(data)
    return response.data.filter(pendente)
}

const getTarefa = async id => {    
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

module.exports = {
    getAgenda,
    getTarefa
}