import type { getWorkingHourParams } from '@/types/workingHours'
import { api } from './axios'

let baseURL = "/working_hours"

export async function getWorkingHour(params: getWorkingHourParams) {
    const response = await api.get(`${baseURL}`, { params })
    return response.data
}