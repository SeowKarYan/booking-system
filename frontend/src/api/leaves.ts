import type { createLeaveRequest, getLeaveParams } from '@/types/leaves'
import { api } from './axios'

let baseURL = "/leaves"

export async function createLeave(body: createLeaveRequest) {
    const response = await api.post(`${baseURL}`, body)
    return response.data
}

export async function getLeave(params: getLeaveParams) {
    const response = await api.get(`${baseURL}`, { params })
    return response.data
}