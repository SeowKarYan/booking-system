import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import Doctor from '../model/Doctor.ts';
import Booking from '../model/Booking.ts';
import { Op, UniqueConstraintError, type WhereOptions } from 'sequelize';
import DoctorLeave from '../model/DoctorLeave.ts';
import { addMinutes } from 'date-fns';
import Patient from '../model/Patient.ts';

const router = express.Router();

router.post("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { start_time, doctorId } = req.body

        if (!doctorId || !start_time) {
            return res.status(400).json({ message: "Missing required fields", status: "failed" })
        }

        if (new Date(start_time) <= new Date()) {
            return res.status(400).json({ message: "Cannot booking for past date", status: "failed" })
        }

        const doctor = await Doctor.findByPk(doctorId)
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found", status: "failed" })
        }

        let slotStart = new Date(start_time)
        let duration = doctor.consultation_period
        let slotEnd = addMinutes(slotStart, duration)

        const existingBooking = await Booking.findOne({
            where: {
                start_time: {
                    [Op.lt]: slotEnd
                },
                end_time: {
                    [Op.gt]: slotStart
                },
                status: "Booked",
                doctorId,
            }
        })

        if (existingBooking) {
            return res.status(409).json({ message: "The selected timeslot is already booked, please select another timeslot", status: "failed" })
        }

        const leave = await DoctorLeave.findOne({
            where: {
                start_time: {
                    [Op.lt]: slotEnd
                },
                end_time: {
                    [Op.gt]: slotStart
                },
                doctorId,
            }
        })

        if (leave) {
            return res.status(409).json({ message: "The doctor is on leave, please select another timeslot", status: "failed" })
        }

        let patientId = null
        if (req.user?.role === "Patient") {
            patientId = req.user.id
        }

        if (!patientId) {
            return res.status(400).json({ message: "Invalid Patient ID", status: "failed" })
        }

        const data = await Booking.create({
            status: "Booked",
            start_time: slotStart,
            end_time: slotEnd,
            doctorId,
            patientId,
        })

        return res.status(201).json({ data, message: "Booking created successfully", status: "success" })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            return res.status(409).json({ message: "The selected timeslot is already booked, please select another timeslot", status: "failed" })
        }
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { patientId, doctorId, start_time, end_time, status } = req.query

        const where: WhereOptions = {};

        if (req.user?.role === "Patient") {
            where.patientId = req.user.id
        } else if (patientId) {
            where.patientId = patientId
        }

        if (doctorId) {
            where.doctorId = doctorId
        }

        if (status) {
            where.status = status
        }

        if (typeof start_time === "string" && typeof end_time === "string") {
            where.start_time = { [Op.lt]: new Date(end_time) };
            where.end_time = { [Op.gt]: new Date(start_time) };
        } else {
            where.start_time = { [Op.lt]: new Date() };
            where.end_time = { [Op.gt]: new Date() };
        }

        const data = await Booking.findAll({
            where,
            include: [
                { model: Doctor, attributes: ['name', 'email'] },
                { model: Patient, attributes: ['name', 'email'] }
            ]
        })

        return res.status(200).json({ data, message: "Booking fetched successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

router.patch("/:bookingId", sessionAuthentication, async (req: Request, res: Response) => {
    const { bookingId } = req.params
    const { status } = req.body
    try {
        const booking = await Booking.findByPk(Number(bookingId))
        if (!booking) {
            return res.status(404).json({ message: "Booking not found", status: "failed" })
        }

        if (req.user?.role === "Patient" && booking.patientId !== req.user?.id) {
            return res.status(403).json({ message: "You are not allowed to update this booking", status: "failed" })
        }

        if (status !== "Cancel") {
            return res.status(400).json({ message: "Invalid status", status: "failed" })
        }

        booking.status = status
        let data = await booking.save()

        return res.status(200).json({ data, message: "Booking updated successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router