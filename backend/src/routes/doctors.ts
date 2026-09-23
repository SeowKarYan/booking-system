import express, { type Request, type Response } from 'express';
import { sessionAuthentication } from '../function/middleware.ts';
import Doctor from '../model/Doctor.ts';

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

export default router