import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import Doctor from '../model/Doctor.ts';
import DoctorLeave from '../model/DoctorLeave.ts';
import { Op, type WhereOptions } from 'sequelize';

const router = express.Router();

router.post("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { doctorId, type, start_time, end_time } = req.body

        if (!doctorId || !type || !start_time || !end_time) {
            return res.status(400).json({ message: "Missing required fields", status: "failed" })
        }

        if (req.user?.role === "Patient") {
            return res.status(403).json({ message: "You are not allowed to create leaves", status: "failed" })
        }

        const doctor = await Doctor.findByPk(doctorId)
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found", status: "failed" })
        }

        const existingLeave = await DoctorLeave.findOne({
            where: { doctorId, type, start_time, end_time }
        })

        if (existingLeave) {
            return res.status(409).json({ message: "Leave already created", status: "failed" })
        }

        const data = await DoctorLeave.create({
            doctorId,
            type,
            start_time,
            end_time,
        })

        return res.status(201).json({ data, message: "Doctor leave created successfully", status: "success" })

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { doctorId, type, start_time, end_time } = req.query

        const where: WhereOptions = {};

        if (doctorId) {
            where.doctorId = doctorId
        }

        if (type) {
            where.type = type
        }

        if (typeof start_time === "string" && typeof end_time === "string") {
            where.start_time = { [Op.lt]: new Date(end_time) };
            where.end_time = { [Op.gt]: new Date(start_time) };
        } else {
            where.start_time = { [Op.lt]: new Date() };
            where.end_time = { [Op.gt]: new Date() };
        }

        const data = await DoctorLeave.findAll({
            where,
            include: { model: Doctor, attributes: ['name', 'email'] }
        })

        return res.status(200).json({ data, message: "Leaves fetched successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router