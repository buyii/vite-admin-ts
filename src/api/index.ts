import * as request from '~/utils/request'
const server = import.meta.env.VITE_APP_SERVER

export function Login (data: any) {
  return request.Post(`${server}/user/login`, data)
}

export function Protected (query: any) {
  return request.Get(`${server}/users/protected`, query)
}

export function Login1 (data: any) {
  return request.Post(`${server}/api/user/token`, data)
}

export function Protected1 (query: any) {
  return request.Get(`${server}/api/user/info`, query)
}

export function getCpu (query: any) {
  return request.Get(`${server}/api/admin/get_cpu`, query)
}

export function getDisk (query: any) {
  return request.Get(`${server}/api/admin/get_disk`, query)
}