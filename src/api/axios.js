// 请求拦截器
import axios from "axios"

let instance = axios.create({
  headers: {
    'content-type': 'application/json'
  }
})
// request 拦截器
instance.interceptors.request.use(
config => {
  const token = sessionStorage.getItem('token')
  if (token ) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.authorization = token  //请求头加上token
  }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default instance;