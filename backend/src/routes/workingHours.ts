import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import type { WhereOptions } from 'sequelize';
import WorkingHour from '../model/WorkingHour.ts';

const router = express.Router();

router.get("/", sessionAuthentication, async (req: Request, res: Response) => {
    try {
        const { doctorId, day } = req.query

        const where: WhereOptions = {};

        if (doctorId) {
            where.doctorId = doctorId
        }

        if (day) {
            where.day = day
        }

        const data = await WorkingHour.findAll({ where })

        return res.status(200).json({ data, message: "Doctor working hours fetched successfully", status: "success" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

export default router