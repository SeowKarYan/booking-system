export type createLeaveRequest = {
    doctorId: number;
    type: string;
    start_time: Date;
    end_time: Date;
}

export type getLeaveParams = {
    doctorId?: number;
    type?: string;
    start_time?: Date;
    end_time?: Date;
}