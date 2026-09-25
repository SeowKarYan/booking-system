import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { connectDatabase, disconnectDatabase } from "../src/function/database.ts";
import Booking from "../src/model/Booking.ts";
import Patient from "../src/model/Patient.ts";
import { Op } from "sequelize";
import Doctor from "../src/model/Doctor.ts";
import { addDays, format } from "date-fns";

const agent = request.agent(app);
const agent2 = request.agent(app);

beforeAll(async () => {
    await connectDatabase()

    await agent
        .post("/api/auth/login")
        .send({
            email: "patient@test.com",
            password: "password",
            role: "Patient"
        });

    let patient = await Patient.findOne({ where: { email: { [Op.not]: "patient@test.com" } } })

    await agent2
        .post("/api/auth/login")
        .send({
            email: patient?.email,
            password: "password",
            role: "Patient"
        });
});

afterAll(async () => {
    await disconnectDatabase()

    await agent
        .post("/api/auth/logout")

    await agent2
        .post("/api/auth/logout")

});

describe("POST /api/bookings/", () => {
    it("should allow only one patient to book the same slot", async () => {
        let doctor = await Doctor.findOne({ where: {} })
        let start = format(new Date(), "yyyy-MM-dd")
        let end = addDays(start, 7)
        const availableSlotResponse = await agent
            .get(`/api/doctors/${doctor?.id}/slots?start_time=${start}&end_time=${end}`)

        let startTime = availableSlotResponse.body.data[0].start;

        const slot = {
            doctorId: doctor?.id,
            startTime
        };

        const requestA = agent
            .post("/api/bookings")
            .send(slot)

        const requestB = agent2
            .post("/api/bookings")
            .send(slot)

        const [responseA, responseB] = await Promise.all([
            requestA,
            requestB
        ]);

        const statuses = [
            responseA.status,
            responseB.status
        ].sort();

        expect(statuses).toEqual([201, 409]);

        // Database must contain exactly one booking
        const bookings = await Booking.findAll({
            where: {
                doctorId: slot.doctorId,
                start_time: new Date(slot.startTime)
            }
        });

        expect(bookings).toHaveLength(1);
    });
});