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
        const { start, end } = req.query

        try {
            let startParam = typeof start === "string" ? new Date(start) : undefined;
            let endParam = typeof end === "string" ? new Date(end) : undefined;

            const data = await getAvailableTimeslot(Number(doctorId), startParam, endParam)

            return res.status(200).json({ data, message: "Doctor slots fetched successfully", status: "success" })
        } catch (err) {
            return res.status(400).json({ message: "Error get available timeslot", status: "failed" })
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router