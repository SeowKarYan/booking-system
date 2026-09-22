import Booking from "./Booking.ts"
import Doctor from "./Doctor.ts"
import Leave from "./Leave.ts"
import Patient from "./Patient.ts"
import Receptionist from "./Receptionist.ts"
import WorkingHour from "./WorkingHour.ts"

Doctor.hasMany(Booking)
Booking.belongsTo(Doctor)

Patient.hasMany(Booking)
Booking.belongsTo(Patient)

Receptionist.hasMany(Booking)
Booking.belongsTo(Receptionist)

Doctor.hasMany(WorkingHour)
WorkingHour.belongsTo(Doctor)

Doctor.hasMany(Leave)
Leave.belongsTo(Doctor)