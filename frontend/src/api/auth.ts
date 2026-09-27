import type { loginRequest } from '@/types/auth'
import { api } from './axios'

let baseURL = "/auth"

export async function login(body: loginRequest) {
    const response = await api.post(`${baseURL}/login`, body)
    return response.data
}

export async function logout() {
    const response = await api.post(`${baseURL}/logout`)
    return response.data
}