import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import Doctor from '../model/Doctor.ts';
import { getAvailableTimeslot } from '../function/appointment.ts';

const router = express.Router();

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const data = await Doctor.findAll({
            where: {},
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
            order: [['name', 'ASC']]
        })
        return res.status(200).json({ data, message: "Doctor data fetched successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

router.get("/:doctorId/slots", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const { start_time, end_time } = req.query

        try {
            let startParam = typeof start_time === "string" ? new Date(start_time) : undefined;
            let endParam = typeof end_time === "string" ? new Date(end_time) : undefined;

            const data = await getAvailableTimeslot(Number(doctorId), startParam, endParam)

            return res.status(200).json({ data, message: "Doctor slots fetched successfully", status: "success" })
        } catch (error) {
            return res.status(400).json({ message: error instanceof Error ? error.message : "Error get available timeslot", status: "failed" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router