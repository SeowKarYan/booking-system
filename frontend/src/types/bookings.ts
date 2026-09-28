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

type Booking = {
    id: number;
    status: string;
    start_time: string;
    end_time: string;
    doctor: {
        name: string;
        email: string;
    },
    patient: {
        name: string;
        email: string;
    }
}

export type createBookingResponse = {
    data: {
        status: string;
        start_time: string;
        end_time: string;
        doctorId: number;
        patientId: number;
    };
    message: string;
    status: string;
}

export type getBookingResponse = {
    data: Booking[];
    message: string;
    status: string;
}

export type updateBookingRequest = {
    status: string;
}