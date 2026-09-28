import type { getDoctorSlotParams } from '@/types/doctors'
import { api } from './axios'

let baseURL = "/doctors"

export async function getDoctorList() {
    const response = await api.get(`${baseURL}`)
    return response.data
}

export async function getDoctorSlot(id: number, params: getDoctorSlotParams) {
    const response = await api.get(`${baseURL}/${id}/slots`, { params })
    return response.data
}