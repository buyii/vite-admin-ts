import axios from 'axios'
import { useRouter } from "vue-router"
let router = useRouter()
// axios 配置
axios.defaults.timeout = 20000;
// // http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.retCode === '000302') {
      localStorage.clear()
      let fullPath = window.location.href.split('#')[1]
      router.replace({ name: 'login', params: { type: 1 }, query: { redirect: fullPath }  })
    }
    return response;
  },
  err => {
    console.log('-----',JSON.stringify(err))
  }
);
function build (url:String, method:String, data:any, params = null, contentType = 'application/x-www-form-urlencoded') {
  const headers:any = { 'Content-Type': contentType }

  // token
  var token = localStorage.getItem('token')

  if (token != null) {
    headers.Authorization = 'Bearer ' + token
  }

  var options:any = { url: url, method: method, headers: headers }
  if (params != null) options.params = params
  if (data != null) options.data = data

  return axios(options)
}

async function callback (obj:any) {
  return await obj.then(function (response:any) {
      if(response.status===200){
        return response.data
      }
    })
    .catch(function (error:any) {
      if (error.response) {
        console.log(error.response)
      }
      return error.response
    })
}

export async function Get (url:String, params:any, contentType = 'application/x-www-form-urlencoded') {
  var obj = build(url, 'get', null, params, contentType)
  return await callback(obj)
}

export async function Post (url:String, data:any, contentType = 'application/x-www-form-urlencoded') {
  var obj = build(url, 'post', data, null, contentType)
  return await callback(obj)
}

export async function Put (url:String, data:any, contentType = 'application/x-www-form-urlencoded') {
  var obj = build(url, 'put', data, null, contentType)
  return await callback(obj)
}

export async function Delete (url:String, data:any, params:any, contentType = 'application/x-www-form-urlencoded') {
  var obj = build(url, 'delete', data, params, contentType)
  return await callback(obj)
}

export async function Patch (url:String, data:any, contentType = 'application/x-www-form-urlencoded') {
  var obj = build(url, 'patch', data, null, contentType)
  return await callback(obj)
}
