export type loginRequest = {
    email: string;
    password: string;
    role: string;
}

export type loginResponse = {
    data: {
        id: number;
        name: string;
        role: "Patient" | "Receptionist";
    },
    message: string;
    status: string;
}