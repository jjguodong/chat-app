import axios from 'axios'

const service = axios.create({
  timeout: 60 * 1000,
})


export const chatApi = async (params) => {
  return await service({
    url: '/api/chat/prompt',
    method: 'post',
    data: params
  })
}