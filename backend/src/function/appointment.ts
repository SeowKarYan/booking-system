import { addDays, addMinutes, differenceInDays, endOfDay, setHours, setMinutes, startOfDay } from "date-fns";
import Doctor from "../model/Doctor.ts";
import WorkingHour from "../model/WorkingHour.ts";
import Booking from "../model/Booking.ts";
import { Op } from "sequelize";
import DoctorLeave from "../model/DoctorLeave.ts";

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

const isOverlapping = (
    slotStart: Date,
    slotEnd: Date,
    startTime: Date,
    endTime: Date
): boolean => {
    return slotStart < endTime && slotEnd > startTime;
}

export const getAvailableTimeslot = async (
    doctorId: number,
    startDate = new Date(),
    endDate = new Date(),
): Promise<{ start: Date, end: Date }[]> => {

    try {
        const availableSlots: { start: Date, end: Date }[] = [];

        let start = startOfDay(startDate)
        let end = endOfDay(endDate)

        const doctor = await Doctor.findByPk(doctorId, {
            include: [
                {
                    model: WorkingHour,
                    as: "working_hours"
                },
                {
                    model: Booking,
                    as: "bookings",
                    separate: true,
                    where: {
                        start_time: {
                            [Op.lte]: end
                        },
                        end_time: {
                            [Op.gte]: start
                        },
                        status: "Booked"
                    },
                    required: false
                },
                {
                    model: DoctorLeave,
                    as: "doctor_leaves",
                    separate: true,
                    where: {
                        start_time: {
                            [Op.lte]: end
                        },
                        end_time: {
                            [Op.gte]: start
                        }
                    },
                    required: false
                }
            ]
        });

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        let slotDuration = doctor.consultation_period

        const days = differenceInDays(end, start) + 1;

        for (let i = 0; i < days; i++) {

            const currentDate = addDays(start, i);

            const dayOfWeek = currentDate.getDay();

            const todayWorkingHours = doctor.working_hours?.filter(
                wh => wh.day === dayOfWeek
            ) ?? [];

            for (const workingHour of todayWorkingHours) {

                const workStart = timeToMinutes(workingHour.start_time);
                const workEnd = timeToMinutes(workingHour.end_time === "00:00:00" ? "24:00:00" : workingHour.end_time);

                for (
                    let startMinutes = workStart;
                    startMinutes + slotDuration <= workEnd;
                    startMinutes += slotDuration
                ) {

                    const slotStart = setMinutes(
                        setHours(currentDate, Math.floor(startMinutes / 60)),
                        startMinutes % 60
                    );

                    // check whether slot already pass
                    if (slotStart <= new Date()) {
                        continue;
                    }

                    const slotEnd = addMinutes(slotStart, slotDuration);

                    // check leave
                    const isOnLeave = doctor.doctor_leaves?.some(leave =>
                        isOverlapping(
                            new Date(slotStart),
                            new Date(slotEnd),
                            new Date(leave.start_time),
                            new Date(leave.end_time)
                        )
                    );

                    if (isOnLeave) {
                        continue;
                    }

                    // check booking
                    const isBooked = doctor.bookings?.some(booking =>
                        isOverlapping(
                            new Date(slotStart),
                            new Date(slotEnd),
                            new Date(booking.start_time),
                            new Date(booking.end_time)
                        )
                    );

                    if (isBooked) {
                        continue;
                    }

                    // available
                    availableSlots.push({
                        start: slotStart,
                        end: slotEnd
                    });
                }
            }
        }

        return availableSlots;
    } catch (error) {
        console.error("Error get available timeslot", error)
        throw new Error(error instanceof Error ? error.message : "Error get available timeslot")
    }
}