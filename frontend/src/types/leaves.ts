type leave = {
    start_time: string;
    end_time: string;
    type: string;
    doctorId: number;
    doctor?: {
        name: string;
        email: string;
    },
}

export type createLeaveRequest = {
    doctorId: number;
    type: string;
    start_time: string;
    end_time: string;
}

export type createLeaveResponse = {
    data: leave[],
    message: string;
    status: string;
}

export type getLeaveParams = {
    doctorId?: number;
    type?: string;
    start_time?: string;
    end_time?: string;
}

export type getLeaveResponse = {
    data: leave[],
    message: string;
    status: string;
}