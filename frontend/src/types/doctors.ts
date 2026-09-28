export type getDoctorSlotParams = {
    start_time?: string;
    end_time?: string;
}

export type Doctor = {
    id: number;
    name: string;
    email: string;
    consultation_period: number;
}

export type getDoctorListResponse = {
    data: Doctor[];
    message: string;
    status: string;
}

export type getDoctorSlotResponse = {
    data: { start: string, end: string }[];
    message: string;
    status: string;
}