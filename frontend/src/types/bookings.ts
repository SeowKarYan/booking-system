export type createBookingRequest = {
    start_time: string;
    doctorId: number;
}

export type getBookingParams = {
    patientId?: number;
    doctorId?: number;
    start_time?: string;
    end_time?: string;
    status?: string;
}

export type updateBookingRequest = {
    status: string;
}