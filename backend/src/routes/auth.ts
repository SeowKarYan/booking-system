import express, { type Request, type Response } from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Patient from '../model/Patient.ts';
import Receptionist from '../model/Receptionist.ts';

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Please fill in all the required fields", status: "failed" });
        }

        let foundUser = null
        if (role === "Patient") {
            foundUser = await Patient.findOne({ where: { email } })
        } else if (role === "Receptionist") {
            foundUser = await Receptionist.findOne({ where: { email } })
        }

        if (!foundUser) {
            return res.status(404).json({ message: "User not found", status: "failed" });
        }

        const match = bcrypt.compareSync(password, foundUser.password);
        if (match) {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "JWT secret is not defined", status: "failed" });
            }
            let token = jwt.sign({ id: foundUser.id, role }, process.env.JWT_SECRET, { expiresIn: "1h" })

            res.cookie("session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ message: "Login successfully", status: "success" });
        } else {
            return res.status(400).json({ message: "Password is incorrect", status: "failed" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", status: "failed" })
    }
})

router.post("/logout", (req: Request, res: Response) => {
    res.clearCookie("session");

    return res.status(200).json({ message: "Logged out", status: "success" });
})

export default router