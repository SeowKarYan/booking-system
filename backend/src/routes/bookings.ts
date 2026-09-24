import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import Doctor from '../model/Doctor.ts';
import Booking from '../model/Booking.ts';
import { Op, UniqueConstraintError, type WhereOptions } from 'sequelize';
import DoctorLeave from '../model/DoctorLeave.ts';
import { addDays, addMinutes } from 'date-fns';

const router = express.Router();

router.post("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { startTime, doctorId } = req.body

        if (!doctorId || !startTime) {
            return res.status(400).json({ message: "Missing required fields", status: "failed" })
        }

        const doctor = await Doctor.findByPk(doctorId)
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found", status: "failed" })
        }

        let slotStart = new Date(startTime)
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
                status: "Booked"
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
        const { patientId, doctorId, startTime, endTime, status } = req.query

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

        if (typeof startTime === "string" && typeof endTime === "string") {
            where.start_time = { [Op.lt]: new Date(endTime) };
            where.end_time = { [Op.gt]: new Date(startTime) };
        } else {
            where.start_time = { [Op.lt]: addDays(new Date(), 30) };
            where.end_time = { [Op.gt]: new Date() };
        }

        const data = await Booking.findAll({ where })

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

        booking.status = status
        let data = await booking.save()

        return res.status(200).json({ data, message: "Booking updated successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router