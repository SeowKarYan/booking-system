import type { createBookingRequest, getBookingParams, updateBookingRequest } from '@/types/bookings'
import { api } from './axios'

let baseURL = "/bookings"

export async function createBooking(body: createBookingRequest) {
    const response = await api.post(`${baseURL}`, body)
    return response.data
}

export async function getBooking(params: getBookingParams) {
    const response = await api.get(`${baseURL}`, { params })
    return response.data
}

export async function updateBooking(id: number, body: updateBookingRequest) {
    const response = await api.patch(`${baseURL}/${id}`, body)
    return response.data
}